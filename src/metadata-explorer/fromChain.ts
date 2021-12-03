import type {RpcClient} from "../rpc/client"
import {Version, Explorer} from "./explorer"
import {ChainVersion} from "./types"


export async function fromChain(client: RpcClient, from: number = 0): Promise<ChainVersion[]> {
    let headHash = await client.call('chain_getFinalizedHead')
    let height = await client.call('chain_getHeader', [headHash]).then((head: any) => {
        return Number.parseInt(head.number)
    })
    checkChainHeight(from, height)
    let versions = await Explorer.getVersions([from, Math.max(from, height - 1)], heights => {
        return fetchVersionsFromChain(client, heights)
    })
    return fetchVersionMetadata(client, versions)
}


export async function fetchVersionsFromChain(client: RpcClient, heights: number[]): Promise<Version[]> {
    let hashes = checkBatch(await client.batch(
        heights.map(h => {
            return ['chain_getBlockHash', [h]]
        })
    ))

    let runtimeVersions = checkBatch(await client.batch(
        hashes.map(hash => {
            return ['chain_getRuntimeVersion', [hash]]
        })
    ))

    return runtimeVersions.map((v, idx) => {
        return {
            blockNumber: heights[idx],
            blockHash: hashes[idx],
            specVersion: v.specVersion
        }
    })
}


function checkBatch<T>(batchResponse: (T | Error)[]): T[] {
    for (let i = 0; i < batchResponse.length; i++) {
        let res = batchResponse[i]
        if (res instanceof Error) {
            throw res
        }
    }
    return batchResponse as T[]
}


export async function fetchVersionMetadata(client: RpcClient, versions: Version[]): Promise<ChainVersion[]> {
    let records: ChainVersion[] = []
    while (versions.length) {
        let batch = versions.slice(0, 10)
        versions = versions.slice(10)
        console.log(`Fetching metadata for versions ${batch[0].specVersion}..${batch[batch.length - 1].specVersion}`)

        let heights = versions.map(v => v.blockNumber == 0 ? 0 : v.blockNumber + 1)

        let hashes: string[] = checkBatch(await client.batch(
            heights.map(h => {
                return ['chain_getBlockHash', [h]]
            })
        ))

        for (let i = 0; i < hashes.length; i++) {
            let metadata = await client.call('state_getMetadata', [hashes[i]])
            records.push({
                ...batch[i],
                metadata
            })
        }
    }
    return records
}


export function checkChainHeight(from: number, height: number): void {
    if (from > height - 1 && from > 0) {
        throw new Error(`Exploration from block #${from} is not possible. Chain at least should reach height ${from + 1}`)
    }
}
