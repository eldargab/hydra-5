import {RpcClient} from "./rpc/client"


export type SpecVersion = number


export interface _Version {
    specVersion: SpecVersion
    blockNumber: number
    blockHash: string
}


export interface ChainVersion extends _Version {
    metadata: string
}


export type ChainVersions = ChainVersion[]


export async function getChainVersions(url: string): Promise<ChainVersion[]> {
    let client = new RpcClient(url)
    let headHash = await client.call('chain_getFinalizedHead')
    let height = await client.call('chain_getHeader', [headHash]).then((head: any) => {
        return Number.parseInt(head.number)
    })
    let versions = await Explorer.getVersions([0, height], heights => {
        return fetchVersionsFromChain(client, heights)
    })
    return fetchMetadata(client, versions)
}


class Explorer {
    private queue: [beg: _Version, end: _Version][] = []
    private versions = new Map<SpecVersion, _Version>()

    private constructor(
        private first: number,
        private last: number,
        private fetch: (heights: number[]) => Promise<_Version[]>
    ) {
    }

    private add(v: _Version): void {
        this.versions.set(v.specVersion, v)
    }

    private async explore() {
        let [beg, end] = await this.fetch([this.first, this.last])

        this.add(beg)
        if (beg.specVersion != end.specVersion) {
            this.add(end)
            this.queue.push([beg, end])
        }

        let step = 0
        while (this.queue.length) {
            let batch = this.queue.slice(0, 20)
            this.queue = this.queue.slice(20)

            step += 1
            console.log(`Exploration step: ${step}, versions known so far: ${this.versions.size}`)

            let heights = batch.map(([b, e]) => b.blockNumber + Math.floor((e.blockNumber - b.blockNumber) / 2))
            let versions = await this.fetch(heights)
            batch.forEach(([b, e], idx) => {
                let m = versions[idx]
                if (b.specVersion != m.specVersion) {
                    this.add(m)
                }
                if (b.specVersion != m.specVersion && m.blockNumber - b.blockNumber > 1) {
                    this.queue.push([b, m])
                }
                if (m.specVersion != e.specVersion && e.blockNumber - m.blockNumber > 1) {
                    this.queue.push([m, e])
                }
            })
        }
    }

    static async getVersions(
        blockRange: [beg: number, end: number],
        fetch: (heights: number[]) => Promise<_Version[]>
    ): Promise<_Version[]> {
        let explorer = new Explorer(blockRange[0], blockRange[1], fetch)
        await explorer.explore()
        return Array.from(explorer.versions.values()).sort((a, b) => a.blockNumber - b.blockNumber)
    }
}


async function fetchVersionsFromChain(client: RpcClient, heights: number[]): Promise<_Version[]> {
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


async function fetchMetadata(client: RpcClient, versions: _Version[]): Promise<ChainVersion[]> {
    let records: ChainVersion[] = []
    while (versions.length) {
        let batch = versions.slice(0, 10)
        versions = versions.slice(10)
        console.log(`Fetching metadata for versions ${batch[0].specVersion}..${batch[batch.length - 1].specVersion}`)

        checkBatch(await client.batch(
            batch.map(v => ['state_getMetadata', [v.blockHash]])
        )).forEach((metadata, idx) => {
            records.push({
                ...batch[idx],
                metadata
            })
        })
    }
    return records
}
