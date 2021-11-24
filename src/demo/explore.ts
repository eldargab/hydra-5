import * as fs from "fs"
import {SpecCache} from "../old/metadata-old/cache"


async function main(): Promise<void> {
    let spec = SpecCache.read('chainSpec.json')
    let out = JSON.stringify(spec.map(s => {
        return {...s, metadata: s.metadata.toHex()}
    }), null, 2)
    fs.writeFileSync('chainSpecBinary.json', out)
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
