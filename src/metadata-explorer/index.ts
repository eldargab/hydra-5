import {RpcClient} from "../rpc/client"
import {fromChain} from "./fromChain"
import {fromIndexer} from "./fromIndexer"
import type {ChainVersion} from "./types"


export * from "./types"


export interface ExplorationOptions {
    chainEndpoint: string
    indexerUrl?: string
    startBlock?: number
}


export async function exploreChainVersions(options: ExplorationOptions): Promise<ChainVersion[]> {
    let client = new RpcClient(options.chainEndpoint)
    try {
        if (options.indexerUrl) {
            return await fromIndexer(client, options.indexerUrl, options.startBlock)
        } else {
            return await fromChain(client, options.startBlock)
        }
    } finally {
        client.close()
    }
}
