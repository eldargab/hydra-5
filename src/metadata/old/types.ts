import {Field, Primitive, Ti, Type as ScaleType, TypeKind, Variant} from "../../scale/types"
import {unexpectedCase} from "../../util/util"
import {ArrayType, NamedType, printType, TupleType, Type, TypeExpParser} from "./typeExp"


export type TypeExp = string


export interface EnumDefinition {
    _enum: string[] | Record<string, TypeExp | null>
    _struct?: undefined
}


export interface StructDefinition {
    _struct: Record<string, TypeExp>
    _enum?: undefined
}


export type TypeDefinition = TypeExp | EnumDefinition | StructDefinition


export interface TypesAlias {
    [pallet: string]: {
        [name: string]: TypeExp
    }
}


export interface Types {
    types: Record<string, TypeDefinition>
    typesAlias?: TypesAlias
}


export class TypeRegistry {
    public readonly scaleTypes: ScaleType[] = []
    private lookup = new Map<TypeExp, Ti>()

    constructor(private types: Types) {}

    use(typeExp: TypeExp | Type): Ti {
        let type = typeof typeExp == 'string' ? TypeExpParser.parse(typeExp) : typeExp
        let key = printType(type)
        let ti = this.lookup.get(key)
        if (ti == null) {
            ti = this.scaleTypes.push({__kind: TypeKind.DoNotConstruct})
            this.lookup.set(key, ti)
            let t = this.buildScaleType(type)
            if (typeof t == 'number') {
                if (t < ti) { // Means there are no references to `ti`
                    ti = t
                    this.scaleTypes.pop()
                } else { // Here duplication is still possible, but there is no harm in it
                    this.scaleTypes[ti] = this.scaleTypes[t]
                }
            } else {
                this.scaleTypes[ti] = t
            }
        }
        return ti
    }

    private buildScaleType(type: Type): ScaleType | Ti {
        switch(type.kind) {
            case 'named':
                return this.buildNamedType(type)
            case 'array':
                return this.buildArray(type)
            case 'tuple':
                return this.buildTuple(type)
            default:
                throw unexpectedCase((type as any).kind)
        }
    }

    private buildNamedType(type: NamedType): ScaleType | Ti {
        let primitive = asPrimitive(type.name)
        if (primitive) {
            assertNoParams(type)
            return {
                __kind: TypeKind.Primitive,
                primitive
            }
        }
        switch(type.name) {
            case 'Vec': {
                let param = this.use(assertOneParam(type))
                return {
                    __kind: TypeKind.Sequence,
                    type: param
                }
            }
            case 'Option': {
                let param = this.use(assertOneParam(type))
                return {
                    __kind: TypeKind.Option,
                    type: param
                }
            }
            case 'Compact': {
                let param = assertOneParam(type)
                let primitive = param.kind == 'named' && asPrimitive(param.name)
                if (!primitive || primitive[0] != 'U') {
                    throw new Error(`Only primitive unsigned numbers can be compact`)
                }
                return {
                    __kind: TypeKind.Compact,
                    type: this.use(param)
                }
            }
        }
        if (type.params.length > 0) {
            // Following polkadot.js we ignore all type parameters which we don't understand
            // This will create duplicate entries, but that's not critical
            return this.use({
                ...type,
                params: []
            })
        }
        let def = this.types.types[type.name]
        if (def == null) {
            throw new Error(`Type ${type.name} is not defined`)
        }
        if (typeof def == 'string') {
            return this.use(def)
        }
        if (def._enum) {
            return this.buildEnum(def)
        }
        throw new Error()
    }

    private buildEnum(def: EnumDefinition): ScaleType {
        let variants: Variant[] = []
        if (Array.isArray(def._enum)) {
            variants = def._enum.map((name, index) => {
                return {
                    name,
                    index,
                    fields: []
                }
            })
        } else {
            let index = 0
            for (let name in def._enum) {
                let type = def._enum[name]
                let fields: Field[] = []
                if (type != null) {

                }
                variants.push({name, index, fields})
                index += 1
            }
        }
        return {
            __kind: TypeKind.Variant,
            variants
        }
    }

    private buildArray(type: ArrayType): ScaleType {
        throw new Error()
    }

    private buildTuple(type: TupleType): ScaleType {
        throw new Error()
    }
}


function assertOneParam(type: NamedType): Type {
    if (type.params.length != 1) {
        throw new Error(`${type.name} should have 1 type parameter`)
    }
    return type.params[0]
}


function assertNoParams(type: NamedType): void {
    if (type.params.length != 0) {
        throw new Error(`${type.name} should not have type parameters`)
    }
}


function asPrimitive(name: string): Primitive | undefined {
    switch(name.toLowerCase()) {
        case 'i8':
            return 'I8'
        case 'u8':
            return 'U8'
        case 'i16':
            return 'I16'
        case 'u16':
            return 'U16'
        case 'i32':
            return 'I32'
        case 'u32':
            return 'U32'
        case 'i64':
            return 'I64'
        case 'u64':
            return 'U64'
        case 'i128':
            return 'I128'
        case 'u128':
            return 'U128'
        case 'i256':
            return 'I256'
        case 'u256':
            return 'U256'
        case 'bool':
            return 'Bool'
        case 'str':
            return 'Str'
        default:
            return undefined
    }
}
