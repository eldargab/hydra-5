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
    Variant
}


export interface PrimitiveDef {
    __kind: TypeKind.Primitive
    primitive: Primitive
}


export interface CompactDef {
    __kind: TypeKind.Compact
    type: Ti
}


export interface SequenceDef {
    __kind: TypeKind.Sequence
    type: Ti
}


export interface BitSequenceDef {
    __kind: TypeKind.BitSequence
    bitStoreType: Ti
    bitOrderType: Ti
}


export interface ArrayDef {
    __kind: TypeKind.Array
    len: number
    type: Ti
}


export interface TupleDef {
    __kind: TypeKind.Tuple
    tuple: Ti[]
}


export interface CompositeDef {
    __kind: TypeKind.Composite
    fields: Field[]
}


export interface Field {
    name: string | null
    type: Ti
}


export interface VariantDef {
    __kind: TypeKind.Variant
    __index?: (Variant | undefined)[]
    variants: Variant[]
}


export interface Variant {
    index: number
    name: string
    fields: Field[]
}


export type TypeDef =
    PrimitiveDef |
    CompactDef |
    SequenceDef |
    BitSequenceDef |
    ArrayDef |
    TupleDef |
    CompositeDef |
    VariantDef


export interface Type {
    path: string[]
    def: TypeDef
    docs: string[]
}
