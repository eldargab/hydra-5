import assert from "assert"
import {getCamelCase} from "../util/naming"
import {assertNotNull, unexpectedCase} from "../util/util"
import {Src} from "./src"
import type {
    ArrayType,
    BytesArrayType,
    Field,
    OptionType,
    Registry,
    SequenceType,
    Ti,
    TupleType,
    VariantType
} from "./types"
import {Primitive, TypeKind} from "./types"


export function decode(registry: Registry, type: Ti, src: Src): any {
    let def = registry[type]
    switch(def.kind) {
        case TypeKind.Primitive:
            return decodePrimitive(def.primitive, src)
        case TypeKind.Compact:
            return src.compact()
        case TypeKind.BitSequence:
            return decodeBitSequence(src)
        case TypeKind.Array:
            return decodeArray(registry, def, src)
        case TypeKind.Sequence:
            return decodeSequence(registry, def, src)
        case TypeKind.Tuple:
            return decodeTuple(registry, def, src)
        case TypeKind.Composite:
            return decodeComposite(registry, def, src)
        case TypeKind.Variant:
            return decodeVariant(registry, def, src)
        case TypeKind.Option:
            return decodeOption(registry, def, src)
        case TypeKind.BooleanOption:
            return decodeBooleanOption(src)
        case TypeKind.Bytes:
            return decodeBytes(src)
        case TypeKind.BytesArray:
            return decodeBytesArray(def, src)
        case TypeKind.DoNotConstruct:
            throw new Error('DoNotConstruct type reached')
        default:
            throw unexpectedCase((def as any).__kind)
    }
}


function decodeVariant(registry: Registry, def: VariantType, src: Src): any {
    let idx = src.u8()
    let variant = def.variants[idx]
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
            [variant.name]: decodeCompositeTuple(registry, variant.fields, src)
        }
    }
    let value = decodeComposite(registry, variant, src)
    value.__kind = variant.name
    return value
}


function decodeComposite(registry: Registry, def: {fields: Field[]}, src: Src): any {
    if (def.fields.length == 0) return null
    if (def.fields[0].name == null) return decodeCompositeTuple(registry, def.fields, src)
    let result: any = {}
    for (let i = 0; i < def.fields.length; i++) {
        let f = def.fields[i]
        let key = getCamelCase(assertNotNull(f.name))
        result[key] = decode(registry, f.type, src)
    }
    return result
}


function decodeCompositeTuple(registry: Registry, fields: Field[], src: Src): any {
    switch(fields.length) {
        case 0:
            return null
        case 1:
            assert(fields[0].name == null)
            return decode(registry, fields[0].type, src)
        default:
            let result: any = new Array(fields.length)
            for (let i = 0; i < fields.length; i++) {
                let f = fields[i]
                assert(f.name == null)
                result[i] = decode(registry, f.type, src)
            }
            return result
    }
}


function decodeTuple(registry: Registry, def: TupleType, src: Src): any {
    switch(def.tuple.length) {
        case 0:
            return null
        case 1:
            return decode(registry, def.tuple[0], src)
        default:
            let result: any[] = new Array(def.tuple.length)
            for (let i = 0; i < def.tuple.length; i++) {
                result[i] = decode(registry, def.tuple[i], src)
            }
            return result
    }
}


function decodeBytes(src: Src): Uint8Array {
    let len = src.compactLength()
    return src.bytes(len)
}


function decodeSequence(registry: Registry, def: SequenceType, src: Src): any[] {
    let len = src.compactLength()
    let result: any[] = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = decode(registry, def.type, src)
    }
    return result
}


function decodeArray(registry: Registry, def: ArrayType, src: Src): any[] {
    let {len, type} = def
    let result: any[] = new Array(len)
    for (let i = 0; i < len; i++) {
        result[i] = decode(registry, type, src)
    }
    return result
}


function decodeBitSequence(src: Src): Uint8Array {
    let len = Math.ceil(src.compactLength() / 8)
    return src.bytes(len)
}


function decodeBytesArray(def: BytesArrayType, src: Src): Uint8Array {
    return src.bytes(def.len)
}


export function decodeOption(registry: Registry, def: OptionType, src: Src): null | any {
    let byte = src.u8()
    switch(byte) {
        case 0:
            return null
        case 1:
            return decode(registry, def.type, src)
        default:
            throw unexpectedCase(byte.toString())
    }
}


export function decodeBooleanOption(src: Src): boolean | null {
    let byte = src.u8()
    switch(byte) {
        case 0:
            return null
        case 1:
            return true
        case 2:
            return false
        default:
            throw unexpectedCase(byte.toString())
    }
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
