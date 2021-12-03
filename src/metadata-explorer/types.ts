export type SpecVersion = number


export interface ChainVersion {
    specVersion: SpecVersion
    /**
     * The height of the block where the given spec version was introduced.
     */
    blockNumber: number
    /**
     * The hash of the block where the given spec version was introduced.
     */
    blockHash: string
    /**
     * Chain metadata for this version of spec
     *
     * It is a metadata at `blockNumber + 1` height
     */
    metadata: string
}
