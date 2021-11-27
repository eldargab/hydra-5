import {getChainVersions} from "../metadata-explorer"

async function main(): Promise<void> {
    await getChainVersions(process.argv[2])
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
