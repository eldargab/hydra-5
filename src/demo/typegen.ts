import {kusamaBundle} from "../chains/kusama"
import {Typegen} from "../typegen/typegen"
import {OutDir} from "../util/out"
import {readJson} from "../util/util"


async function main(): Promise<void> {
    let chain = readJson('kusamaChainVersions.json')

    let outDir = new OutDir('src/a-types')
    outDir.del()

    Typegen.generate({
        outDir,
        chain,
        typesBundle: kusamaBundle,
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
