import assert from "assert"
import {assertNotNull, def} from "../util/util"
import type {EventMetadataV9, FunctionMetadataV9, Metadata, MetadataV14} from "./interfaces"
import {OldTypeRegistry, OldTypes} from "./old/types"
import {Ti, TypeKind, TypeRegistry, Variant} from "./types"
import {normalizeByteSequences} from "./util"


export interface ChainSpec {
    types: TypeRegistry
    calls: Ti
}


export function createChainSpecFromMetadata(metadata: Metadata, oldTypes?: OldTypes): ChainSpec {
    switch(metadata.__kind) {
        case "V9":
        case "V10":
        case "V11":
        case "V12":
        case "V13":
            assert(oldTypes, `Type definitions are required for metadata ${metadata.__kind}`)
            return new FromOld(metadata, oldTypes).convert()
        case "V14":
            return fromV14(metadata.value)
        default:
            throw new Error(`Unsupported metadata version: ${metadata.__kind}`)
    }
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

    return {
        types,
        calls: metadata.extrinsic.type // FIXME: not correct
    }
}


class FromOld {
    private registry

    constructor(private metadata: Metadata, oldTypes: OldTypes) {
        this.registry = new OldTypeRegistry(oldTypes)
    }

    convert(): ChainSpec {
        // order is important
        let calls = this.calls()
        return {
            types: this.registry.getTypeRegistry(),
            calls
        }
    }

    @def
    private calls(): Ti {
        return this.registry.create('GenericCall', () => {
            let variants: Variant[] = []
            this.forEachPallet_Call((palletName, index, calls) => {
                variants.push({
                    name: palletName,
                    index,
                    fields: [
                        {type: assertNotNull(this.makeCallEnum(calls))}
                    ]
                })
            })
            return {
                kind: TypeKind.Variant,
                variants: variants
            }
        })
    }

    private makeEventEnum(events?: EventMetadataV9[]): Ti | undefined {
        if (!events?.length) return undefined
        let variants = events.map((e, index) => {
            let fields = e.args.map(arg => {
                return {
                    type: this.registry.use(arg)
                }
            })
            return {
                index,
                name: e.name,
                fields,
                docs: e.docs
            }
        })
        return this.registry.add({
            kind: TypeKind.Variant,
            variants
        })
    }

    private makeCallEnum(calls?: FunctionMetadataV9[]): Ti | undefined {
        if (!calls?.length) return undefined
        let variants = calls.map((call, index) => {
            let fields = call.args.map(arg => {
                return {
                    name: arg.name,
                    type: this.registry.use(arg.type)
                }
            })
            return {
                index,
                name: call.name,
                fields,
                docs: call.docs
            }
        })
        return this.registry.add({
            kind: TypeKind.Variant,
            variants
        })
    }

    private forEachPallet_Call(cb: (palletName: string, palletIndex: number, calls: FunctionMetadataV9[]) => void): void {
        switch(this.metadata.__kind) {
            case 'V12':
            case 'V13': {
                this.metadata.value.modules.forEach(mod => {
                    if (!mod.calls?.length) return
                    cb(mod.name, mod.index, mod.calls)
                })
                return
            }
        }
    }
}
