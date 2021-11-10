import {ApiPromise, WsProvider} from "@polkadot/api"
import {getSpecVersionsAt} from "./metadata/explorer"
import {Typegen} from "./typegen/gen"
import {OutDir} from "./util/out"


async function chain(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama.api.onfinality.io/public-ws')
    return await ApiPromise.create({provider})
}


async function main(): Promise<void> {
    let api = await chain()

    let specs = await getSpecVersionsAt(api, [
        0,
        5000000,
        10000000
    ])

    let typegen = new Typegen({
        chainSpec: specs,
        outDir: new OutDir('src/_gen'),
        events: [
            'balances.Transfer',
            'staking.Reward'
        ]
    })

    let events = typegen.events()
}


function print(obj: any): void {
    console.log(JSON.stringify(obj, null, 2))
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
