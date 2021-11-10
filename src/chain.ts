import {ApiPromise} from "@polkadot/api"
import {MetadataLatest} from "@polkadot/types/interfaces"
import assert from "assert"
import {indexerRequest} from "./util/indexer"


export interface Spec {
    version: number
    blockNumber: number
    blockHash: string
    metadata: MetadataLatest
}


type Version = Omit<Spec, 'metadata'>


export async function getSpecVersionsAt(api: ApiPromise, heights: number[]): Promise<Spec[]> {
    let specs: Spec[] = []
    for (let i = 0; i < heights.length; i++) {
        let spec = await getSpecAt(api, heights[i])
        specs.push(spec)
    }
    specs.sort((a, b) => a.blockNumber - b.blockNumber)
    return specs
}


export function getSpecVersions(api: ApiPromise, indexerUrl?: string): Promise<Spec[]> {
    if (indexerUrl) {
        return getSpecVersionsFromChainAndIndexer(api, indexerUrl)
    } else {
        return getSpecVersionsFromChain(api)
    }
}


export async function getSpecVersionsFromChainAndIndexer(api: ApiPromise, indexerUrl: string): Promise<Spec[]> {
    let height: number = await indexerRequest(indexerUrl, `
        query {
            indexerStatus {
                head
            }
        }
    `).then(res => res.indexerStatus.head)

    let specs: Spec[] = []

    specs.push(await getSpecAt(api, 0))
    specs.push(await getSpecAt(api, height))

    if (specs[1].version === specs[0].version) {
        specs.pop()
        return specs
    }

    if (height <= 1) {
        return specs
    }

    let versions: Version[] = []

    let queue: [Version, Version][] = [
        [specs[0], specs[1]]
    ]

    while (queue.length) {
        let batch = queue
        queue = []

        console.log(`batch size: ${batch.length}`)
        let middleHeights = batch.map(([b, e]) => b.blockNumber + Math.floor((e.blockNumber - b.blockNumber) / 2))
        let middleVersions = await getVersions(api, indexerUrl, middleHeights)

        batch.forEach(([b, e], idx) => {
            let m = middleVersions[idx]
            if (b.version != m.version && m.version != e.version) {
                versions.push(m)
            }
            if (b.version != m.version && m.blockNumber - b.blockNumber > 1) {
                queue.push([b, m])
            }
            if (m.version != e.version && e.blockNumber - m.blockNumber > 1) {
                queue.push([m, e])
            }
        })
    }

    specs.sort((a, b) => a.blockNumber - b.blockNumber)
    return specs
}


async function getVersions(api: ApiPromise, indexerUrl: string, heights: number[]): Promise<Version[]> {
    let fields = heights.map(h => {
        return `h${h}: substrate_block(where: {height: {_eq: ${h}}}) { version: runtimeVersion(path: "$.specVersion") blockNumber: height blockHash: hash }`
    })
    let res = await indexerRequest(indexerUrl, `query { ${fields.join(' ')} }`)
    let versions: Version[] = []
    let idx = 0
    for (let key in res) {
        let list: Version[] = res[key]
        if (list.length === 0) {
            versions.push(await getVersionAt(api, heights[idx]))
        } else {
            assert(list.length === 1)
            versions.push(list[0])
        }
        idx += 1
    }
    return versions
}


export async function getSpecVersionsFromChain(api: ApiPromise): Promise<Spec[]> {
    let height = await getChainHeight(api)
    let specs: Spec[] = []

    specs.push(await getSpecAt(api, 0))
    specs.push(await getSpecAt(api, height))

    if (specs[1].version === specs[0].version) {
        specs.pop()
        return specs
    }

    let versions: Version[] = []

    let queue: [Version, Version][] = [
        [specs[0], specs[1]]
    ]

    while (queue.length) {
        let [b, e] = queue.pop()!
        console.log(`investigating range [${b.blockNumber}, ${e.blockNumber}], versions: [${b.version}, ${e.version}]`)
        let h = b.blockNumber + Math.floor((e.blockNumber - b.blockNumber) / 2)
        let m = await getVersionAt(api, h)
        if (b.version != m.version && m.version != e.version) {
            versions.push(m)
        }
        if (b.version != m.version && m.blockNumber - b.blockNumber > 1) {
            queue.push([b, m])
        }
        if (m.version != e.version && e.blockNumber - m.blockNumber > 1) {
            queue.push([m, e])
        }
    }

    for (let i = 0; i < versions.length; i++) {
        let v = versions[i]
        let metadata = await api.rpc.state.getMetadata(v.blockHash)
        specs.push({...v, metadata: metadata.asLatest})
        console.log(`Fetched metadata for block ${v.blockNumber}`)
    }

    specs.sort((a, b) => a.blockNumber - b.blockNumber)
    return specs
}


async function getSpecAt(api: ApiPromise, height: number): Promise<Spec> {
    let version = await getVersionAt(api, height)
    let metadata = await api.rpc.state.getMetadata(version.blockHash)
    return {
        ...version,
        metadata: metadata.asLatest
    }
}


async function getVersionAt(api: ApiPromise, height: number): Promise<Version> {
    let hash = await api.rpc.chain.getBlockHash(height)
    let runtime = await api.rpc.state.getRuntimeVersion(hash)
    return {
        version: runtime.specVersion.toNumber(),
        blockNumber: height,
        blockHash: hash.toHex()
    }
}


async function getChainHeight(api: ApiPromise): Promise<number> {
    let hash = await api.rpc.chain.getFinalizedHead()
    let header = await api.rpc.chain.getHeader(hash)
    return header.number.toNumber()
}
