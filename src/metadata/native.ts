import type {MetadataLatest, SiType} from "@polkadot/types/interfaces"

/**
 * Chain runtime information
 */
export interface Spec {
    /**
     * Spec version.
     *
     * Blocks with the same chain spec supposed to have the same metadata
     */
    version: number
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
    metadata: MetadataLatest
}


/**
 * Index of a type in metadata lookup table
 */
export type Ti = number


export function getTypesCount(metadata: MetadataLatest): number {
    return metadata.lookup.types.length
}


export function forEachType(metadata: MetadataLatest, cb: (type: SiType, ti: Ti) => void): void {
    for (let i = 0; i < getTypesCount(metadata); i++) {
        let type = metadata.lookup.getSiType(i)
        cb(type, i)
    }
}
