import {types as metadataDefinitions} from "./definitions/metadata"
import {types as substrateDefinitions} from "./definitions/substrate"
import type {OldTypes, OldTypesBundle, SpecVersion, SpecVersionRange} from "./types"


export function getTypesFromBundle(bundle: OldTypesBundle, specVersion: SpecVersion): OldTypes {
    let types: OldTypes = {
        types: {
            ...metadataDefinitions as any,
            ...substrateDefinitions as any,
            ...bundle.types
        }
    }

    if (bundle.typesAlias) {
        types.typesAlias = bundle.typesAlias
    }

    if (!bundle.overrides?.length) return types

    for (let i = 0; i < bundle.overrides.length; i++) {
        let override = bundle.overrides[i]
        if (isWithinRange(override.minmax, specVersion)) {
            Object.assign(types.types, override.types)
            if (override.typesAlias) {
                types.typesAlias = {...types.typesAlias, ...override.typesAlias}
            }
        }
    }

    return types
}


function isWithinRange(range: SpecVersionRange, version: SpecVersion): boolean {
    let beg = range[0] ?? 0
    let end = range[1] ?? Infinity
    return beg <= version && version <= end
}
