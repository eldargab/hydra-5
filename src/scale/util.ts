import {Type, TypeDef, TypeKind, Variant} from "./types"


export function getTypesFromMetadata(json: any): Type[] {
    let jsonTypes: any[] = json.lookup.types
    let types: Type[] = new Array(jsonTypes.length)
    for (let i = 0; i < jsonTypes.length; i++) {
        let jt = jsonTypes[i].type
        let jd = jt.def
        let def: TypeDef
        if (jd.primitive) {
            def = {
                __kind: TypeKind.Primitive,
                primitive: jd.primitive
            }
        } else if (jd.compact) {
            def = {
                __kind: TypeKind.Compact,
                type: jd.compact.type
            }
        } else if (jd.sequence) {
            def = {
                __kind: TypeKind.Sequence,
                type: jd.sequence.type
            }
        } else if (jd.bitSequence) {
            def = {
                __kind: TypeKind.BitSequence,
                bitStoreType: jd.bitSequence.bitStoreType,
                bitOrderType: jd.bitSequence.bitOrderType
            }
        } else if (jd.array) {
            def = {
                __kind: TypeKind.Array,
                len: jd.array.len,
                type: jd.array.type
            }
        } else if (jd.tuple) {
            def = {
                __kind: TypeKind.Tuple,
                tuple: jd.tuple.slice()
            }
        } else if (jd.composite) {
            def = {
                __kind: TypeKind.Composite,
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
                __kind: TypeKind.Variant,
                __index: index,
                variants
            }
        } else {
            throw new Error(`Unknown type definition: ${JSON.stringify(jd)}`)
        }
        types[i] = {
            path: jt.path,
            def,
            docs: jt.docs
        }
    }
    return types
}
