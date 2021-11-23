import {Codec as ScaleCodec, Field, Primitive, Ti, Type as ScaleType, TypeKind, Variant} from "../../scale"
import {unexpectedCase} from "../../util/util"
import {ArrayType, NamedType, printType, TupleType, Type, TypeExpParser} from "./typeExp"


export type OldTypeDefinition = OldTypeExp | OldEnumDefinition | OldStructDefinition


export type OldTypeExp = string


export interface OldStructDefinition extends Record<string, OldTypeExp> {}


export interface OldEnumDefinition {
    _enum: string[] | Record<string, OldTypeExp | OldStructDefinition | null>
}


export interface OldTypesAlias {
    [pallet: string]: {
        [name: string]: OldTypeExp
    }
}


export interface OldTypes {
    types: Record<string, OldTypeDefinition>
    typesAlias?: OldTypesAlias
}


export class OldTypeRegistry {
    private scaleTypes: ScaleType[] = []
    private lookup = new Map<OldTypeExp, Ti>()

    constructor(private types: OldTypes) {}

    getScaleCodec(): ScaleCodec {
        return new ScaleCodec(this.scaleTypes)
    }

    use(typeExp: OldTypeExp | Type): Ti {
        let type = typeof typeExp == 'string' ? TypeExpParser.parse(typeExp) : typeExp
        let key = printType(type)
        let ti = this.lookup.get(key)
        if (ti == null) {
            ti = this.scaleTypes.push({kind: TypeKind.DoNotConstruct}) - 1
            this.lookup.set(key, ti)
            let t = this.buildScaleType(type)
            if (typeof t == 'number') {
                this.scaleTypes[ti] = this.scaleTypes[t]
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
                kind: TypeKind.Primitive,
                primitive
            }
        }
        switch(type.name) {
            case 'DoNotConstruct':
                return {
                    kind: TypeKind.DoNotConstruct
                }
            case 'Vec': {
                let param = this.use(assertOneParam(type))
                return {
                    kind: TypeKind.Sequence,
                    type: param
                }
            }
            case 'Bytes': {
                assertNoParams(type)
                return this.use('Vec<u8>')
            }
            case 'Option': {
                let param = this.use(assertOneParam(type))
                return {
                    kind: TypeKind.Option,
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
                    kind: TypeKind.Compact,
                    type: this.use(param)
                }
            }
        }
        if (type.params.length > 0) {
            // Following polkadot.js we ignore all type parameters which we don't understand
            return this.use(type.name)
        }
        let def = this.types.types[type.name]
        if (def == null) {
            throw new Error(`Type ${type.name} is not defined`)
        }
        if (typeof def == 'string') {
            return this.use(def)
        } else if (def._enum) {
            return this.buildEnum(def as OldEnumDefinition)
        } else {
            return this.buildStruct(def as OldStructDefinition)
        }
    }

    private buildEnum(def: OldEnumDefinition): ScaleType {
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
                if (typeof type == 'string') {
                    fields.push({
                        name: null,
                        type: this.use(type)
                    })
                } else if (type != null) {
                    for (let key in type) {
                        fields.push({
                            name: key,
                            type: this.use(type[key])
                        })
                    }
                }
                variants.push({
                    name,
                    index,
                    fields
                })
                index += 1
            }
        }
        return {
            kind: TypeKind.Variant,
            variants
        }
    }

    private buildStruct(def: OldStructDefinition): ScaleType {
        let fields: Field[] = []
        for (let name in def) {
            fields.push({
                name,
                type: this.use(def[name])
            })
        }
        return {
            kind: TypeKind.Composite,
            fields
        }
    }

    private buildArray(type: ArrayType): ScaleType {
        return {
            kind: TypeKind.Array,
            type: this.use(type.item),
            len: type.len
        }
    }

    private buildTuple(type: TupleType): ScaleType {
        return {
            kind: TypeKind.Tuple,
            tuple: type.params.map(p => this.use(p))
        }
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
        case 'text':
            return 'Str'
        default:
            return undefined
    }
}
