import assert from "assert"
import type {EventMetadataV9, FunctionMetadataV9, Metadata, MetadataV13, MetadataV14} from "./interfaces"
import {OldTypeRegistry, OldTypes} from "./old/types"
import {Ti, TypeKind, TypeRegistry, Variant} from "./types"
import {normalizeByteSequences} from "./util"


export interface ChainSpec {
    types: TypeRegistry
    pallets: PalletSpec[]
}


export interface PalletSpec {
    name: string
    events?: Ti
    calls?: Ti
}


export function createChainSpecFromMetadata(metadata: Metadata, oldTypes?: OldTypes): ChainSpec {
    switch(metadata.__kind) {
        case 'V13':
            assertOldTypes('V13', oldTypes)
            return fromV13(metadata.value, oldTypes)
        case 'V14':
            return fromV14(metadata.value)
        default:
            throw new Error(`Unsupported metadata version: ${metadata.__kind}`)
    }
}


function assertOldTypes(v: string, oldTypes?: OldTypes): asserts oldTypes {
    assert(oldTypes, `Type definitions are required for metadata ${v}`)
}


function fromV14(metadata: MetadataV14): ChainSpec {
    let types: TypeRegistry = metadata.lookup.types.map(t => {
        let info = {
            path: t.type.path,
            docs: t.type.docs
        }
        let def = t.type.def
        switch(def.__kind) {
            case 'Primitive':
                return {
                    kind: TypeKind.Primitive,
                    primitive: def.value.__kind,
                    ...info
                }
            case "Compact":
                return {
                    kind: TypeKind.Compact,
                    type: def.value.type,
                    ...info
                }
            case "Sequence":
                return {
                    kind: TypeKind.Sequence,
                    type: def.value.type,
                    ...info
                }
            case "BitSequence":
                return {
                    kind: TypeKind.BitSequence,
                    bitStoreType: def.value.bitStoreType,
                    bitOrderType: def.value.bitOrderType,
                    ...info
                }
            case "Array":
                return {
                    kind: TypeKind.Array,
                    type: def.value.type,
                    len: def.value.len,
                    ...info
                }
            case "Tuple":
                return {
                    kind: TypeKind.Tuple,
                    tuple: def.value,
                    ...info
                }
            case "Composite":
                return {
                    kind: TypeKind.Composite,
                    fields: def.value.fields,
                    ...info
                }
            case "Variant":
                return {
                    kind: TypeKind.Variant,
                    variants: def.value.variants,
                    ...info
                }
        }
    })

    types = normalizeByteSequences(types)

    let pallets = metadata.pallets.map(pallet => {
        return {
            name: pallet.name,
            events: pallet.events?.type,
            calls: pallet.calls?.type
        }
    })

    return {
        types,
        pallets
    }
}


function fromV13(metadata: MetadataV13, oldTypes: OldTypes): ChainSpec {
    let registry = new OldTypeRegistry(oldTypes)

    let pallets = metadata.modules.map(mod => {
        return {
            name: mod.name,
            events: makeEventType(registry, mod.events),
            calls: makeCallType(registry, mod.calls)
        }
    })

    return {
        types: registry.getTypeRegistry(),
        pallets
    }
}


function makeEventType(registry: OldTypeRegistry, events?: EventMetadataV9[]): Ti | undefined {
    if (!events?.length) return undefined
    let variants = events.map((e, index) => {
        let fields = e.args.map(arg => {
            return {
                type: registry.use(arg)
            }
        })
        return {
            index,
            name: e.name,
            fields,
            docs: e.docs
        }
    })
    return registry.add({
        kind: TypeKind.Variant,
        variants
    })
}


function makeCallType(registry: OldTypeRegistry, calls?: FunctionMetadataV9[]): Ti | undefined {
    if (!calls?.length) return undefined
    let variants = calls.map((call, index) => {
        let fields = call.args.map(arg => {
            return {
                name: arg.name,
                type: registry.use(arg.type)
            }
        })
        return {
            index,
            name: call.name,
            fields,
            docs: call.docs
        }
    })
    return registry.add({
        kind: TypeKind.Variant,
        variants
    })
}
