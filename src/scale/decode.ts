import assert from "assert"
import {getCamelCase} from "../util/naming"
import {assertNotNull, unexpectedCase} from "../util/util"
import {Src} from "./src"
import type {ArrayDef, Field, SequenceDef, Ti, TupleDef, TypeDef, VariantDef} from "./types"
import {Primitive, TypeKind} from "./types"


export function decodeBinary(types: TypeDef[], type: Ti, data: Uint8Array): any {
    let src = new Src(data)
    let val = decode(types, type, src)
    assert(!src.hasBytes())
    return val
}


export function decode(types: TypeDef[], type: Ti, src: Src): any {
    let def = types[type]
    switch(def.__kind) {
        case TypeKind.Primitive:
            return decodePrimitive(def.primitive, src)
        case TypeKind.Compact:
            return src.compact()
        case TypeKind.BitSequence:
            return decodeBitSequence(src)
        case TypeKind.Array:
            return decodeArray(types, def, src)
        case TypeKind.Sequence:
            return decodeSequence(types, def, src)
        case TypeKind.Tuple:
            return decodeTuple(types, def, src)
        case TypeKind.Composite:
            return decodeComposite(types, def, src)
        case TypeKind.Variant:
            return decodeVariant(types, def, src)
    }
}


export function decodeVariant(types: TypeDef[], def: VariantDef, src: Src): any {
    let idx = src.u8()
    let variant = assertNotNull(def.__index)[idx]
    if (variant == null) {
        throw new Error('Unexpected variant index')
    }
    if (variant.fields.length == 0) {
        return {
            __kind: variant.name
        }
    }
    if (variant.fields[0].name == null) {
        return {
            __kind: variant.name,
            [variant.name]: decodeCompositeTuple(types, variant.fields, src)
        }
    }
    let value = decodeComposite(types, variant, src)
    value.__kind = variant.name
    return value
}


export function decodeComposite(types: TypeDef[], def: {fields: Field[]}, src: Src): any {
    if (def.fields.length == 0) return null
    if (def.fields[0].name == null) return decodeCompositeTuple(types, def.fields, src)
    let result: any = {}
    for (let i = 0; i < def.fields.length; i++) {
        let f = def.fields[i]
        let key = getCamelCase(assertNotNull(f.name))
        result[key] = decode(types, f.type, src)
    }
    return result
}


function decodeCompositeTuple(types: TypeDef[], fields: Field[], src: Src): any {
    switch(fields.length) {
        case 0:
            return null
        case 1:
            assert(fields[0].name == null)
            return decode(types, fields[0].type, src)
        default:
            let result: any = new Array(fields.length)
            for (let i = 0; i < fields.length; i++) {
                let f = fields[i]
                assert(f.name == null)
                result[i] = decode(types, f.type, src)
            }
            return result
    }
}


export function decodeTuple(types: TypeDef[], def: TupleDef, src: Src): any {
    switch(def.tuple.length) {
        case 0:
            return null
        case 1:
            return decode(types, def.tuple[0], src)
        default:
            let result: any[] = new Array(def.tuple.length)
            for (let i = 0; i < def.tuple.length; i++) {
                result[i] = decode(types, def.tuple[i], src)
            }
            return result
    }
}


export function decodeSequence(types: TypeDef[], def: SequenceDef, src: Src): any[] {
    let len = src.compactLength()
    let result: any[] = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = decode(types, def.type, src)
    }
    return result
}


export function decodeArray(types: TypeDef[], def: ArrayDef, src: Src): any[] {
    let {len, type} = def
    let result: any[] = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = decode(types, type, src)
    }
    return result
}


export function decodeBitSequence(src: Src): Uint8Array {
    let len = Math.ceil(src.compactLength() / 8)
    return src.bytes(len).slice(0)
}


export function decodePrimitive(type: Primitive, src: Src): any {
    switch(type) {
        case 'I8':
            return src.i8()
        case 'U8':
            return src.u8()
        case 'I16':
            return src.i16()
        case 'U16':
            return src.u16()
        case 'I32':
            return src.i32()
        case 'U32':
            return src.u32()
        case 'I64':
            return src.i64()
        case 'U64':
            return src.u64()
        case 'I128':
            return src.i128()
        case 'U128':
            return src.u128()
        case 'I256':
            return src.i256()
        case 'U256':
            return src.u256()
        case 'Bool':
            return src.bool()
        case 'Str':
            return src.str()
        default:
            throw unexpectedCase(type)
    }
}
