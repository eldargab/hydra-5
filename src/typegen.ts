import type {MetadataLatest} from "@polkadot/types/interfaces"
import {Interfaces} from "./ifs"
import {OutDir} from "./util/out"


export interface TypegenOptions {
    outDir: OutDir
    metadata: MetadataLatest[]
    events?: string[]
    calls?: string[]
}


export function typegen(options: TypegenOptions): void {
    options.metadata.forEach((metadata, idx) => {
        let version = 'v' + (idx + 1)
        let dir = options.outDir.child(version)
        let ifs = new Interfaces(metadata)

        metadata.pallets.forEach(pallet => {
            let mod = dir.file(`${pallet.name}.ts`)
            if (pallet.events.isSome) {
                let events = pallet.events.unwrap()
            }
        })
    })
}
