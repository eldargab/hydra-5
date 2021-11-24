import {Metadata, TypeRegistry} from "@polkadot/types"
import type {MetadataLatest, SiType} from "@polkadot/types/interfaces"
import {lowerCaseFirst} from "../../util/util"


export type SpecVersion = number


/**
 * Chain runtime information
 */
export interface Spec {
    /**
     * Spec version.
     *
     * Blocks with the same chain spec supposed to have the same metadata
     */
    specVersion: SpecVersion
    /**
     * The chain height at which this spec first occurred
     */
    blockNumber: number
    /**
     * Hash of a first block with this spec.
     */
    blockHash: string
    /**
     * Substrate metadata
     */
    metadata: Metadata
}


/**
 * Index of a type in metadata lookup table
 */
export type Ti = number


/**
 * The name of event or extrinsic in `{lowerCaseFirst(pallet)}.{variantName}` format
 */
export type QualifiedName = string


export function toQualifiedName(pallet: string, name: string): QualifiedName {
    return lowerCaseFirst(pallet) + '.' + name
}


export function getTypesCount(metadata: MetadataLatest): number {
    return metadata.lookup.types.length
}


export function forEachType(metadata: MetadataLatest, cb: (type: SiType, ti: Ti) => void): void {
    for (let i = 0; i < getTypesCount(metadata); i++) {
        let type = metadata.lookup.getSiType(i)
        cb(type, i)
    }
}


export function decodeMetadata(raw: string | object): Metadata {
    let registry = new TypeRegistry()
    let metadata = new Metadata(registry, raw as any)
    registry.setMetadata(metadata)
    return metadata
}
