import * as fs from "fs"
import {exploreChainVersions} from "../metadata-explorer"


async function main(): Promise<void> {
    let versions = await exploreChainVersions({
        chainEndpoint: 'wss://kusama-rpc.polkadot.io',
        indexerUrl: 'https://kusama.indexer.gc.subsquid.io/v4/graphql'
    })
    fs.writeFileSync('kusamaChainVersions.json', JSON.stringify(versions, null, 2))
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
