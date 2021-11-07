import {ApiPromise, WsProvider} from "@polkadot/api"
import * as fs from "fs"
import Table from "easy-table"
import {Interfaces} from "./ifs"
import {getTypesCount, TypeHasher} from "./metadata"
import {OutDir} from "./util/out"


async function chain(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama-rpc.polkadot.io')
    return await ApiPromise.create({provider})
}


async function main(): Promise<void> {
    let api = await chain()

    let blockHash = await api.rpc.chain.getBlockHash(8000000)
    let metadata = (await api.at(blockHash)).registry.metadata

    fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))

    let src = new OutDir('src')
    let ifs = new Interfaces(metadata)

    metadata.pallets.forEach(p => {
        if (p.events.isNone) return
        let events = metadata.lookup.getSiType(p.events.unwrap().type).def.asVariant.variants
        events.forEach(e => {
            e.fields.forEach(f => ifs.use(f.type.toNumber()))
        })
    })

    ifs.write(src.file('_interfaces.ts'))
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
