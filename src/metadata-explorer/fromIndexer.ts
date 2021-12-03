import type {RpcClient} from "../rpc/client"
import {indexerRequest} from "../util/indexer"
import {assertNotNull} from "../util/util"
import {Explorer, Version} from "./explorer"
import {checkChainHeight, fetchVersionMetadata, fetchVersionsFromChain} from "./fromChain"
import type {ChainVersion} from "./types"


export async function fromIndexer(
    chainClient: RpcClient,
    indexerUrl: string,
    from: number = 0
): Promise<ChainVersion[]> {
    let height: number = await indexerRequest(indexerUrl, `
        query {
            indexerStatus {
                head
            }
        }
    `).then(res => res.indexerStatus.head)

    checkChainHeight(from, height)

    let versions = await Explorer.getVersions([from, height], heights => {
        return fetchVersionsFromIndexer(chainClient, indexerUrl, heights)
    })

    return fetchVersionMetadata(chainClient, versions)
}


async function fetchVersionsFromIndexer(chainClient: RpcClient, indexerUrl: string, heights: number[]): Promise<Version[]> {
    let response: {substrate_block: Version[]} = await indexerRequest(
        indexerUrl,
        `query {
            substrate_block(where: {height: {_in: [${heights.join(', ')}]}}) {
                specVersion: runtimeVersion(path: "$.specVersion") 
                blockNumber: height 
                blockHash: hash
            }
         }`
    )

    let mapping = new Map(response.substrate_block.map(v => [v.blockNumber, v]))

    if (mapping.size != heights.length) {
        // Workaround for some indexers, which don't start from block 0 for historical reasons
        let missing = heights.filter(h => !mapping.has(h))
        let missingVersions = await fetchVersionsFromChain(chainClient, missing)
        missingVersions.forEach(v => mapping.set(v.blockNumber, v))
    }

    return heights.map(h => assertNotNull(mapping.get(h)))
}
