import {
    ChainDescription,
    decodeMetadata,
    getChainDescriptionFromMetadata,
    OldTypesBundle,
    SpecVersion
} from "../metadata"
import {getTypesFromBundle} from "../metadata/old/typesBundle"
import {RpcClient} from "../rpc/client"
import {RuntimeVersion} from "./interfaces/substrate"


interface BlockInfo {
    height: number
    parentHash: string
    runtimeVersion: SpecVersion | RuntimeVersion
}


interface DescriptionItem {
    blockHeight: number
    description: ChainDescription
}


export class MetadataManager {
    private descriptions = new Map<SpecVersion, DescriptionItem>()

    constructor(private client: RpcClient, private typesBundle: OldTypesBundle = {types: {}}) {
    }

    async getChainDescription(block: BlockInfo): Promise<ChainDescription> {
        let specVersion = typeof block.runtimeVersion == 'number'
            ? block.runtimeVersion
            : block.runtimeVersion.specVersion

        let d = this.descriptions.get(specVersion)
        if (d != null && d.blockHeight < block.height) return d.description

        let height = Math.max(0, block.height - 1)
        let rtv: RuntimeVersion = await this.client.call('chain_getRuntimeVersion', [block.parentHash])
        d = this.descriptions.get(rtv.specVersion)
        if (d == null) {
            let metadataHex: string = await this.client.call('state_getMetadata', [block.parentHash])
            d = this.descriptions.get(rtv.specVersion)
            if (d == null) {
                d = this.describe(rtv.specVersion, height, metadataHex)
                this.descriptions.set(rtv.specVersion, d)
            }
        }
        d.blockHeight = Math.min(d.blockHeight, height)
        return d.description
    }

    private describe(specVersion: SpecVersion, blockHeight: number, metadataHex: string): DescriptionItem {
        let metadata = decodeMetadata(metadataHex)
        let types = getTypesFromBundle(this.typesBundle, specVersion)
        let description = getChainDescriptionFromMetadata(metadata, types)
        return {
            blockHeight: Math.max(0, blockHeight),
            description
        }
    }
}
