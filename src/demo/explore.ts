import fs from "fs"
import {RpcClient} from "../rpc/client"


async function main(): Promise<void> {
    let client = new RpcClient('wss://kusama-rpc.polkadot.io/')
    let specs = JSON.parse(fs.readFileSync('chainSpecBinary.json', 'utf-8'))
    let metadataRequests = specs.slice(0, 10).map((s: any) => {
        return ['state_getMetadata', [s.blockHash]]
    })
    let metadata = await client.batch(metadataRequests)
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
