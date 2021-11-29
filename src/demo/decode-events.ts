import {xxhashAsU8a} from "@polkadot/util-crypto"
import * as fs from "fs"
import {createChainSpecFromMetadata, decodeMetadata} from "../metadata"
import {ChainVersion} from "../metadata-explorer"
import {RpcClient} from "../rpc/client"
import {Codec} from "../scale"
import {readJson} from "../util/util"


async function main(): Promise<void> {
    let versions: ChainVersion[] = JSON.parse(fs.readFileSync('chainVersions.json', 'utf-8'))
    let oldTypes = readJson('types.json')
    let client = new RpcClient('wss://kusama-rpc.polkadot.io/')

    versions.sort((a, b) => a.blockNumber - b.blockNumber)

    for (let i = 50; i < versions.length; i++) {
        let version = versions[i]

        let blockHash: string = await client.call('chain_getBlockHash', [version.blockNumber + 1])
        let encodedMetadata = await client.call('state_getMetadata', [blockHash])
        let metadata = decodeMetadata(encodedMetadata)
        let spec = createChainSpecFromMetadata(metadata, {types: oldTypes})
        let codec = new Codec(spec.types)
        console.log(`version: ${version.specVersion}, metadata: ${metadata.__kind}`)

        for (let j = version.blockNumber + 1; j < Math.min(version.blockNumber + 20, versions[i+1]?.blockNumber ?? Infinity); j++) {
            console.log(`block: #${j}`)
            let encodedEvents = await getEvents(client, blockHash)
            let events = codec.decodeBinary(spec.eventRecordList, encodedEvents)
            console.log(`events: ${events.length}`)
        }
    }
}


function getEvents(client: RpcClient, blockHash: string) {
    let moduleHash = xxhashAsU8a('System', 128)
    let itemHash = xxhashAsU8a('Events', 128)
    let key = '0x' + Buffer.from([...moduleHash, ...itemHash]).toString('hex')
    return client.call('state_getStorageAt', [key, blockHash])
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
