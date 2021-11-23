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
    BytesArray,
    DoNotConstruct
}


export interface PrimitiveType {
    kind: TypeKind.Primitive
    primitive: Primitive
}


export interface CompactType {
    kind: TypeKind.Compact
    type: Ti
}


export interface SequenceType {
    kind: TypeKind.Sequence
    type: Ti
}


export interface BitSequenceType {
    kind: TypeKind.BitSequence
    bitStoreType: Ti
    bitOrderType: Ti
}


export interface ArrayType {
    kind: TypeKind.Array
    len: number
    type: Ti
}


export interface TupleType {
    kind: TypeKind.Tuple
    tuple: Ti[]
}


export interface CompositeType {
    kind: TypeKind.Composite
    fields: Field[]
}


export interface Field {
    name: string | null
    type: Ti
}


export interface VariantType {
    kind: TypeKind.Variant
    variants: (Variant | undefined)[]
}


export interface Variant {
    index: number
    name: string
    fields: Field[]
}


export interface OptionType {
    kind: TypeKind.Option
    type: Ti
}


export interface BooleanOptionType {
    kind: TypeKind.BooleanOption
}


export interface BytesType {
    kind: TypeKind.Bytes
}


export interface BytesArrayType {
    kind: TypeKind.BytesArray
    len: number
}


export interface DoNotConstructType {
    kind: TypeKind.DoNotConstruct
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
    BytesArrayType |
    DoNotConstructType


interface CheckedOptionType extends OptionType {
    checked: true
}


interface CheckedSequenceType extends SequenceType {
    checked: true
}


interface CheckedArrayType extends ArrayType {
    checked: true
}


type CheckedType =
    PrimitiveType |
    CompactType |
    CheckedSequenceType |
    BitSequenceType |
    CheckedArrayType |
    TupleType |
    CompositeType |
    VariantType |
    CheckedOptionType |
    BooleanOptionType |
    BytesType |
    BytesArrayType |
    DoNotConstructType


export type Registry = CheckedType[]
