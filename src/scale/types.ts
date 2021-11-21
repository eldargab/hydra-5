export type Ti = number


export type Primitive =
    'I8' | 'U8' |
    'I16' | 'U16' |
    'I32' | 'U32' |
    'I64' | 'U64' |
    'I128' | 'U128' |
    'I256' | 'U256' |
    'Bool' |
    'Str'


export enum TypeKind {
    Primitive,
    Compact,
    Sequence,
    BitSequence,
    Array,
    Tuple,
    Composite,
    Variant,
    Option,
    /**
     * Option<bool>
     */
    BooleanOption,
    /**
     * Vec<u8>
     */
    Bytes,
    /**
     * [u8; 10]
     */
    BytesArray
}


export interface PrimitiveType {
    __kind: TypeKind.Primitive
    primitive: Primitive
}


export interface CompactType {
    __kind: TypeKind.Compact
    type: Ti
}


export interface SequenceType {
    __kind: TypeKind.Sequence
    type: Ti
}


export interface BitSequenceType {
    __kind: TypeKind.BitSequence
    bitStoreType: Ti
    bitOrderType: Ti
}


export interface ArrayType {
    __kind: TypeKind.Array
    len: number
    type: Ti
}


export interface TupleType {
    __kind: TypeKind.Tuple
    tuple: Ti[]
}


export interface CompositeType {
    __kind: TypeKind.Composite
    fields: Field[]
}


export interface Field {
    name: string | null
    type: Ti
}


export interface VariantType {
    __kind: TypeKind.Variant
    variants: (Variant | undefined)[]
}


export interface Variant {
    index: number
    name: string
    fields: Field[]
}


export interface OptionType {
    __kind: TypeKind.Option
    type: Ti
}


export interface BooleanOptionType {
    __kind: TypeKind.BooleanOption
}


export interface BytesType {
    __kind: TypeKind.Bytes
}


export interface BytesArrayType {
    __kind: TypeKind.BytesArray
    len: number
}


export type Type =
    PrimitiveType |
    CompactType |
    SequenceType |
    BitSequenceType |
    ArrayType |
    TupleType |
    CompositeType |
    VariantType |
    OptionType |
    BooleanOptionType |
    BytesType |
    BytesArrayType
