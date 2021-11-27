import {Metadata, TypeRegistry} from "@polkadot/types"
import * as fs from "fs"


async function main(): Promise<void> {
    let specs: any[] = JSON.parse(fs.readFileSync('chainVersions.json', 'utf-8'))
    let registry = new TypeRegistry()
    let beg = Date.now()
    let decoded = specs.map(spec => new Metadata(registry, spec.metadata))
    let end = Date.now()
    console.log(end - beg)
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
