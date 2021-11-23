import * as fs from "fs"
import {decodeMetadata} from "../metadata/codec"


async function main(): Promise<void> {
    let specs: any[] = JSON.parse(fs.readFileSync('chainSpecBinary.json', 'utf-8'))
    let beg = Date.now()
    let decoded = specs.map(spec => decodeMetadata(spec.metadata))
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
