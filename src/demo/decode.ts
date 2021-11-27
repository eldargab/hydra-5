import * as fs from "fs"
import {createChainSpecFromMetadata, decodeMetadata} from "../metadata"
import {ChainVersion} from "../metadata-explorer"
import {readJson} from "../util/util"


async function main(): Promise<void> {
    let versions: ChainVersion[] = JSON.parse(fs.readFileSync('chainVersions.json', 'utf-8'))
    let version = versions[51]
    let metadata = decodeMetadata(version.metadata)
    let spec = createChainSpecFromMetadata(metadata, {types: readJson('types.json')})
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
