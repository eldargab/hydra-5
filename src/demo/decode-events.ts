import {xxhashAsU8a} from "@polkadot/util-crypto"
import * as fs from "fs"
import {kusamaBundle} from "../chains/kusama"
import {decodeMetadata, getChainDescriptionFromMetadata} from "../metadata"
import {ChainVersion} from "../metadata-explorer"
import {getTypesFromBundle} from "../metadata/old/typesBundle"
import {RpcClient} from "../rpc/client"
import {Codec} from "../scale"


async function main(): Promise<void> {
    let versions: ChainVersion[] = JSON.parse(fs.readFileSync('chainVersions.json', 'utf-8'))
    let client = new RpcClient('wss://kusama-rpc.polkadot.io/')

    versions.sort((a, b) => a.blockNumber - b.blockNumber)

    for (let i = 0; i < versions.length; i++) {
        let version = versions[i]

        let blockHash: string = await client.call('chain_getBlockHash', [version.blockNumber + 1])
        let encodedMetadata = await client.call('state_getMetadata', [blockHash])
        let metadata = decodeMetadata(encodedMetadata)
        let spec = getChainDescriptionFromMetadata(
            metadata,
            getTypesFromBundle(kusamaBundle, version.specVersion)
        )
        let codec = new Codec(spec.types)
        console.log(`version: ${version.specVersion}, metadata: ${metadata.__kind}`)

        for (let j = version.blockNumber + 1; j < Math.min(version.blockNumber + 10, versions[i+1]?.blockNumber ?? Infinity); j++) {
            console.log(`block: #${j}`)
            let hash = await client.call('chain_getBlockHash', [j])
            let encodedEvents = await getEvents(client, hash)
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
