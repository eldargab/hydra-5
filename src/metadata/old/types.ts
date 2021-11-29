export type OldTypeDefinition = OldTypeExp | OldEnumDefinition | OldStructDefinition | OldSetDefinition


export type OldTypeExp = string


export interface OldStructDefinition extends Record<string, OldTypeExp> {}


export interface OldEnumDefinition {
    _enum: string[] | Record<string, OldTypeExp | OldStructDefinition | null>
    _set?: undefined
}


export interface OldSetDefinition {
    _set: {
        _bitLength: number
    }
    _enum?: undefined
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
