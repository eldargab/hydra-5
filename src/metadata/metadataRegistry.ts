import type {ApiPromise} from "@polkadot/api"
import type {Registry} from "@polkadot/types/types"
import assert from "assert"
import {sha256} from "../util/sha256"
import {QualifiedName, SpecVersion, Ti, toQualifiedName} from "./base"
import {TypeHasher} from "./hash"


interface Arg {
    name?: string
    value: unknown
}


interface Field {
    name: string | null
    type: Ti
    lookupType: string
}


interface VariantInfo {
    fields: Field[]
    hash: string
}


class MetadataEntry {
    private hasher: TypeHasher
    private events: Map<QualifiedName, VariantInfo>

    constructor(public readonly registry: Registry) {
        this.hasher = new TypeHasher(registry.metadata)
        this.events = this.collectEvents()
    }

    hasEvent(name: QualifiedName): boolean {
        return this.events.has(name)
    }

    getEvent(name: QualifiedName): VariantInfo {
        let event = this.getEventIfPresent(name)
        assert(event != null, `Event ${name} not found`)
        return event
    }

    getEventIfPresent(name: QualifiedName): VariantInfo | undefined {
        let event = this.events.get(name)
        if (event != null && !event.hash) {
            event.hash = this.hashVariant(event)
        }
        return event
    }

    private hashVariant(info: VariantInfo): string {
        return sha256(info.fields.map(f => {
            return {
                name: f.name,
                type: this.hasher.getHash(f.type)
            }
        }))
    }

    private collectEvents() {
        let metadata = this.registry.metadata
        let events = new Map<QualifiedName, VariantInfo>()
        metadata.pallets.forEach(pallet => {
            if (pallet.events.isNone) return
            let type = pallet.events.unwrap().type.toNumber()
            let variants = metadata.lookup.getSiType(type).def.asVariant.variants
            variants.forEach(e => {
                let name = toQualifiedName(pallet.name.toString(), e.name.toString())
                assert(!events.has(name), `Name clash found for ${name}`)
                events.set(name, {
                    fields: e.fields.map(f => {
                        return {
                            name: f.name.isSome ? f.name.toString() : null,
                            type: f.type.toNumber(),
                            lookupType: this.registry.createLookupType(f.type)
                        }
                    }),
                    hash: ''
                })
            })
        })
        return events
    }
}


export class MetadataRegistry {
    private registries = new Map<SpecVersion, MetadataEntry>()

    hasMetadataFor(specVersion: SpecVersion): boolean {
        return this.registries.has(specVersion)
    }

    async loadMetadata(api: ApiPromise, blockHash: string): Promise<void> {
        let hash = Buffer.from(blockHash.slice(2), 'hex')
        let vr = await api.getBlockRegistry(hash)
        let specVersion = vr.specVersion.toNumber()
        if (this.registries.has(specVersion)) return
        this.registries.set(
            vr.specVersion.toNumber(),
            new MetadataEntry(vr.registry)
        )
    }

    checkEventCompatibility(name: string, specVersion1: SpecVersion, specVersion2: SpecVersion): boolean {
        let reg1 = this.getRegistry(specVersion1)
        let reg2 = this.getRegistry(specVersion2)
        let e1 = reg1.getEventIfPresent(name)
        let e2 = reg2.getEventIfPresent(name)
        return e1?.hash === e2?.hash
    }

    createEvent(name: string, specVersionOfType: SpecVersion, specVersionOfArgs: SpecVersion, args: Arg[]): any {
        let reg = this.getRegistry(specVersionOfArgs)
        let event = reg.getEvent(name)
        assert(
            event.fields.length === args.length,
            `Event ${name} has ${event.fields.length} arguments, but ${args.length} was supplied`
        )
        if (specVersionOfType !== specVersionOfArgs) {
            let typeReg = this.getRegistry(specVersionOfType)
            let typeEvent = typeReg.getEvent(name)
            assert(
                event.hash === typeEvent.hash,
                `Event ${name} is incompatible between spec versions ${specVersionOfType} and ${specVersionOfArgs}`
            )
        }
        if (args.length === 0) {
            return reg.registry.createType(event.fields[0].lookupType, args[0].value)
        } else {
            let result: any[] = new Array(args.length)
            for (let i = 0; i < args.length; i++) {
                result[i] = reg.registry.createType(event.fields[i].lookupType, args[i].value)
            }
            return result
        }
    }

    private getRegistry(specVersion: SpecVersion): MetadataEntry {
        let e = this.registries.get(specVersion)
        assert(e != null, `Metadata for spec version ${specVersion} is not loaded`)
        return e
    }
}
