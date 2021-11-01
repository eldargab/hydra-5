import {ApiPromise, WsProvider} from "@polkadot/api"
import {Interfaces} from "./gen"
import {OutDir} from "./out"


async function chain(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama-rpc.polkadot.io')
    return await ApiPromise.create({provider})
}


async function main(): Promise<void> {
    let api = await chain()
    let metadata = api.runtimeMetadata.asLatest
    // print(metadata)
    let src = new OutDir('src')
    let ifsFile = src.file('_interfaces.ts')
    let ifs = new Interfaces(metadata, ifsFile)

    metadata.pallets.forEach(p => {
        if (p.events.isNone) return
        let events = metadata.lookup.getSiType(p.events.unwrap().type).def.asVariant.variants
        events.forEach(e => {
            e.fields.forEach(f => ifs.use(f.type.toNumber()))
        })
    })

    ifs.generate()
    ifsFile.write()
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
