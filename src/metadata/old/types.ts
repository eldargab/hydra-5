import {unexpectedCase} from "../../util/util"
import {Field, Primitive, Ti, Type, TypeKind, TypeRegistry, Variant} from "../types"
import {normalizeByteSequences} from "../util"
import * as texp from "./typeExp"


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
    private registry: TypeRegistry = []
    private lookup = new Map<OldTypeExp, Ti>()

    constructor(private oldTypes: OldTypes) {}

    getTypeRegistry(): TypeRegistry {
        return normalizeByteSequences(this.registry)
    }

    use(typeExp: OldTypeExp | texp.Type): Ti {
        let type = typeof typeExp == 'string' ? texp.parse(typeExp) : typeExp
        let key = texp.print(type)
        let ti = this.lookup.get(key)
        if (ti == null) {
            ti = this.registry.push({kind: TypeKind.DoNotConstruct}) - 1
            this.lookup.set(key, ti)
            let t = this.buildScaleType(type)
            if (typeof t == 'number') {
                this.registry[ti] = this.registry[t]
            } else {
                this.registry[ti] = t
            }
        }
        return ti
    }

    private buildScaleType(type: texp.Type): Type | Ti {
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

    private buildNamedType(type: texp.NamedType): Type | Ti {
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
            case 'Null':
                return {
                    kind: TypeKind.Tuple,
                    tuple: []
                }
            case 'GenericAccountId':
                return {
                    kind: TypeKind.BytesArray,
                    len: 32
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
                return {
                    kind: TypeKind.Bytes
                }
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
        let def = this.oldTypes.types[type.name]
        if (def == null) {
            throw new Error(`Type ${type.name} is not defined`)
        }
        let result: Type | Ti
        if (typeof def == 'string') {
            result = this.use(def)
        } else if (def._enum) {
            result = this.buildEnum(def as OldEnumDefinition)
        } else {
            result = this.buildStruct(def as OldStructDefinition)
        }
        if (typeof result == 'object') {
            result.path = [type.name]
        }
        return result
    }

    private buildEnum(def: OldEnumDefinition): Type {
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

    private buildStruct(def: OldStructDefinition): Type {
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

    private buildArray(type: texp.ArrayType): Type {
        return {
            kind: TypeKind.Array,
            type: this.use(type.item),
            len: type.len
        }
    }

    private buildTuple(type: texp.TupleType): Type {
        return {
            kind: TypeKind.Tuple,
            tuple: type.params.map(p => this.use(p))
        }
    }

    add(type: Type): Ti {
        return this.registry.push(type) - 1
    }
}


function assertOneParam(type: texp.NamedType): texp.Type {
    if (type.params.length != 1) {
        throw new Error(`${type.name} should have 1 type parameter`)
    }
    return type.params[0]
}


function assertNoParams(type: texp.NamedType): void {
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
