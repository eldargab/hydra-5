import {Primitive, Registry, Ti, Type, TypeKind, Variant} from "./types"


export function normalizeTypes(types: Type[]): Registry {
    function isPrimitive(primitive: Primitive, ti: Ti): boolean {
        let type = types[ti]
        return type.kind == TypeKind.Primitive && type.primitive == primitive
    }

    return types.map(type => {
        switch(type.kind) {
            case TypeKind.Sequence:
                if (isPrimitive('U8', type.type)) {
                    return {kind: TypeKind.Bytes}
                } else {
                    return type
                }
            case TypeKind.Array:
                if (isPrimitive('U8', type.type)) {
                    return {kind: TypeKind.BytesArray, len: type.len}
                } else {
                    return type
                }
            case TypeKind.Option:
                if (isPrimitive('Bool', type.type)) {
                    return {kind: TypeKind.BooleanOption}
                } else {
                    return type
                }
            default:
                return type
        }
    })
}


export function getTypesFromMetadata(json: any): Type[] {
    let jsonTypes: any[] = json.lookup.types
    let types: Type[] = new Array(jsonTypes.length)

    function isPrimitive(name: string, type: Ti): boolean {
        let def = jsonTypes[type].type.def
        return def?.primitive == name
    }

    function isU8(type: Ti): boolean {
       return isPrimitive('U8', type)
    }

    for (let i = 0; i < jsonTypes.length; i++) {
        let jt = jsonTypes[i].type
        let jd = jt.def
        let def: Type
        if (jd.primitive) {
            def = {
                kind: TypeKind.Primitive,
                primitive: jd.primitive
            }
        } else if (jd.compact) {
            def = {
                kind: TypeKind.Compact,
                type: jd.compact.type
            }
        } else if (jd.sequence) {
            if (isU8(jd.sequence.type)) {
                def = {
                    kind: TypeKind.Bytes
                }
            } else {
                def = {
                    kind: TypeKind.Sequence,
                    type: jd.sequence.type
                }
            }
        } else if (jd.bitSequence) {
            def = {
                kind: TypeKind.BitSequence,
                bitStoreType: jd.bitSequence.bitStoreType,
                bitOrderType: jd.bitSequence.bitOrderType
            }
        } else if (jd.array) {
            if (isU8(jd.array.type)) {
                def = {
                    kind: TypeKind.BytesArray,
                    len: jd.array.len
                }
            } else {
                def = {
                    kind: TypeKind.Array,
                    len: jd.array.len,
                    type: jd.array.type
                }
            }
        } else if (jd.tuple) {
            def = {
                kind: TypeKind.Tuple,
                tuple: jd.tuple.slice()
            }
        } else if (jd.composite) {
            def = {
                kind: TypeKind.Composite,
                fields: jd.composite.fields.slice()
            }
        } else if (jd.variant) {
            let variants: Variant[] = jd.variant.variants.slice()
            let indexLength = variants.reduce((maxIndex, v) => Math.max(maxIndex, v.index), 0) + 1
            let index = new Array(indexLength)
            for (let j = 0; j < variants.length; j++) {
                let v = variants[j]
                index[v.index] = v
            }
            def = {
                kind: TypeKind.Variant,
                variants: index
            }
            let isOption =
                jt.path.length == 1 &&
                jt.path[0] == 'Option' &&
                variants.length == 2 &&
                variants[1].name == 'Some' &&
                variants[1].fields.length == 1
            if (isOption) {
                let optionType = variants[1].fields[0].type
                if (isPrimitive('Bool', optionType)) {
                    def = {
                        kind: TypeKind.BooleanOption
                    }
                } else {
                    def = {
                        kind: TypeKind.Option,
                        type: optionType
                    }
                }
            }
        } else {
            throw new Error(`Unknown type definition: ${JSON.stringify(jd)}`)
        }
        types[i] = def
    }
    return types
}
