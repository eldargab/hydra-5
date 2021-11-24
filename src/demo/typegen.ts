import {SpecCache} from "../old/metadata-old/cache"
import {Typegen} from "../old/typegen/gen"
import {OutDir} from "../util/out"


async function main(): Promise<void> {
    let chainSpec = SpecCache.read('chainSpec.json').sort((a, b) => a.specVersion - b.specVersion)

    let outDir = new OutDir('src/a-project/types')
    outDir.del()

    Typegen.generate({
        outDir,
        chainSpec,
        events: [
            'balances.Transfer',
            'paraInclusion.CandidateIncluded'
        ]
    })
}

main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
