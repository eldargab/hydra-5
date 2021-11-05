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
    let metadata = api.runtimeMetadata.asLatest

    fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))

    // let hasher = new TypeHasher(metadata)
    // let table = new Table()
    // for (let i = 0; i < getTypesCount(metadata); i++) {
    //     let type = metadata.lookup.getSiType(i)
    //     if (type.path.length > 0) {
    //         table.cell('name', type.path[type.path.length - 1])
    //         table.cell('idx', i)
    //         table.cell('hash', hasher.getHash(i))
    //         table.newRow()
    //     }
    // }
    // table.sort(['name', 'idx'])
    // console.log(table.print())

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
