import {Ti, TypeKind, TypeRegistry} from "./types"


export function normalizeByteSequences(types: TypeRegistry): TypeRegistry {
    function isU8(ti: Ti): boolean {
        let type = types[ti]
        return type.kind == TypeKind.Primitive && type.primitive == 'U8'
    }

    return types.map(type => {
        switch(type.kind) {
            case TypeKind.Sequence:
                if (isU8(type.type)) {
                    return {kind: TypeKind.Bytes, docs: type.docs, path: type.path}
                } else {
                    return type
                }
            case TypeKind.Array:
                if (isU8(type.type)) {
                    return {kind: TypeKind.BytesArray, len: type.len, docs: type.docs, path: type.path}
                } else {
                    return type
                }
            default:
                return type
        }
    })
}
