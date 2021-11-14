import {ApiPromise, WsProvider} from "@polkadot/api"
import {SpecCache} from "./metadata/cache"
import {Typegen} from "./typegen/gen"
import {OutDir} from "./util/out"


async function chain(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    return await ApiPromise.create({provider})
}


async function main(): Promise<void> {
    // let api = await chain()
    // let spec = await getSpecVersionsFromChainAndIndexer(api, 'https://kusama.indexer.gc.subsquid.io/v4/graphql', 'chainSpec.json')
    let chainSpec = SpecCache.read('chainSpec.json').sort((a, b) => a.specVersion - b.specVersion)

    let projectDir = new OutDir('src/a-project')
    let typesDir = projectDir.child('types')
    typesDir.del()

    Typegen.generate({
        outDir: typesDir,
        chainSpec,
        events: [
            'balances.Transfer',
            'balances.Deposit',
            'treasury.Deposit',
            'staking.Reward',
            'staking.StakingElection',
            'staking.Slash',
            'staking.StakersElected',
            'staking.Rewarded',
            'staking.Slashed',
            'staking.Bonded',
            'staking.Unbonded'
        ]
    })
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
