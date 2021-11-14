import {ApiPromise} from "@polkadot/api"
import assert from "assert"
import {indexerRequest} from "../util/indexer"
import {Spec, SpecVersion} from "./base"
import {SpecCache} from "./cache"


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


export async function getSpecVersionsFromChainAndIndexer(api: ApiPromise, indexerUrl: string, specFile?: string): Promise<Spec[]> {
    let height: number = await indexerRequest(indexerUrl, `
        query {
            indexerStatus {
                head
            }
        }
    `).then(res => res.indexerStatus.head)

    let versions = new Map<SpecVersion, Version>()
    let queue: [Version, Version][] = []

    function setVersion(v: Version): void {
        versions.set(v.specVersion, v)
    }

    let beg = await getVersionAt(api, 0)
    let end = await getVersionAt(api, height)
    setVersion(beg)
    if (end.specVersion !== beg.specVersion) {
        setVersion(end)
        queue.push([beg, end])
    }

    while (queue.length) {
        let batch = queue
        queue = []

        console.log(`batch size: ${batch.length}`)
        let middleHeights = batch.map(([b, e]) => b.blockNumber + Math.floor((e.blockNumber - b.blockNumber) / 2))
        let middleVersions = await getVersions(api, indexerUrl, middleHeights)

        batch.forEach(([b, e], idx) => {
            let m = middleVersions[idx]
            if (b.specVersion != m.specVersion) {
                setVersion(m)
            }
            if (b.specVersion != m.specVersion && m.blockNumber - b.blockNumber > 1) {
                queue.push([b, m])
            }
            if (m.specVersion != e.specVersion && e.blockNumber - m.blockNumber > 1) {
                queue.push([m, e])
            }
        })
    }

    let specs: Spec[] = []
    let specCache = specFile ? new SpecCache(specFile) : undefined
    let versionList = Array.from(versions.values()).sort((a, b) => a.blockNumber - b.blockNumber)
    for (let i = 0; i < versionList.length; i++) {
        let v = versionList[i]
        let spec = specCache?.get(v.specVersion)
        if (spec == null) {
            let metadata = await api.rpc.state.getMetadata(v.blockHash)
            spec = {...v, metadata}
            specCache?.add(spec)
        }
        specs.push(spec)
        console.log(`Got metadata for block ${v.blockNumber}`)
    }
    specCache?.save()
    return specs
}


async function getVersions(api: ApiPromise, indexerUrl: string, heights: number[]): Promise<Version[]> {
    let fields = heights.map(h => {
        return `h${h}: substrate_block(where: {height: {_eq: ${h}}}) { specVersion: runtimeVersion(path: "$.specVersion") blockNumber: height blockHash: hash }`
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


export async function getSpecAt(api: ApiPromise, height: number): Promise<Spec> {
    let version = await getVersionAt(api, height)
    let metadata = await api.rpc.state.getMetadata(version.blockHash)
    return {...version, metadata}
}


async function getVersionAt(api: ApiPromise, height: number): Promise<Version> {
    let hash = await api.rpc.chain.getBlockHash(height)
    let runtime = await api.rpc.state.getRuntimeVersion(hash)
    return {
        specVersion: runtime.specVersion.toNumber(),
        blockNumber: height,
        blockHash: hash.toHex()
    }
}


async function getChainHeight(api: ApiPromise): Promise<number> {
    let hash = await api.rpc.chain.getFinalizedHead()
    let header = await api.rpc.chain.getHeader(hash)
    return header.number.toNumber()
}
