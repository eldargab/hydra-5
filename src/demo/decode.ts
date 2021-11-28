import * as fs from "fs"
import {createChainSpecFromMetadata, decodeMetadata} from "../metadata"
import {ChainVersion} from "../metadata-explorer"
import {RpcClient} from "../rpc/client"
import {Codec} from "../scale"
import {readJson} from "../util/util"


async function main(): Promise<void> {
    let versions: ChainVersion[] = JSON.parse(fs.readFileSync('chainVersions.json', 'utf-8'))
    let version = versions[52]
    let metadata = decodeMetadata(version.metadata)
    let spec = createChainSpecFromMetadata(metadata, {types: readJson('types.json')})
    let codec = new Codec(spec.types)

    let client = new RpcClient('wss://kusama-rpc.polkadot.io/')

    for (let i = version.blockNumber; i < version.blockNumber + 1; i++) {
        let hash = await client.call('chain_getBlockHash', [i])
        let block = await client.call('chain_getBlock', [hash])
    }
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
