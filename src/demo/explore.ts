import {getChainSpec} from "../metadata-explorer"

async function main(): Promise<void> {
    await getChainSpec(process.argv[2])
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
