import {ApiPromise, WsProvider} from "@polkadot/api"
import * as fs from "fs"
import {getSpecVersions} from "./chain"
import {Interfaces} from "./ifs"
import {OutDir} from "./util/out"


async function chain(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama.api.onfinality.io/public-ws')
    return await ApiPromise.create({provider})
}


async function main(): Promise<void> {
    let api = await chain()

    let specs = await getSpecVersions(api, 'https://kusama.indexer.gc.subsquid.io/v4/graphql')

    // let blockHash = await api.rpc.chain.getBlockHash(8000000)
    // let at = await api.at(blockHash)
    // let metadata = at.registry.metadata
    //
    // fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
    //
    // let src = new OutDir('src')
    // let ifs = new Interfaces(metadata)
    //
    // metadata.pallets.forEach(p => {
    //     if (p.events.isNone) return
    //     let events = metadata.lookup.getSiType(p.events.unwrap().type).def.asVariant.variants
    //     events.forEach(e => {
    //         e.fields.forEach(f => ifs.use(f.type.toNumber()))
    //     })
    // })
    //
    // ifs.write(src.file('_interfaces.ts'))
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
