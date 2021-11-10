import {Spec} from "../metadata/native"
import type {OutDir} from "../util/out"
import {def} from "../util/util"
import {Event, eventEquals} from "./event"
import {Interfaces} from "./ifs"
import {Imports} from "./imports"


export interface TypegenOptions {
    outDir: OutDir
    chainSpec: Spec[]
    events?: string[]
    calls?: string[]
}


export class Typegen {
    constructor(private options: TypegenOptions) {}

    generateEvent() {
        let out = this.options.outDir.child('types.ts')
        let imports = new Imports()
        let events = this.events()
    }

    @def
    interfaces(): Map<number, Interfaces> {
        let m = new Map<number, Interfaces>()
        this.events().forEach(e => {
            let spec = e.spec
            if (m.has(spec.version)) return
            m.set(spec.version, new Interfaces(spec.metadata))
        })
        return m
    }

    @def
    events(): Event[] {
        let events: Event[] = []

        this.options.chainSpec.forEach(spec => {
            spec.metadata.pallets.forEach(pallet => {
                let section = pallet.name.toString().toLowerCase()
                if (pallet.events.isNone) return
                let def = spec.metadata.lookup.getSiType(pallet.events.unwrap().type).def
                def.asVariant.variants.forEach(v => {
                    let name = section + '.' + v.name.toString()
                    if (!this.options.events?.includes(name)) return
                    let event: Event = {
                        spec,
                        pallet: pallet.name.toString(),
                        name: v.name.toString(),
                        fields: v.fields.map(f => {
                            return {
                                name: f.name.toString(),
                                type: f.type.toNumber(),
                                docs: f.docs.map(line => line.toString())
                            }
                        })
                    }
                    let prev = events.find(p => p.pallet === event.pallet && p.name === event.name)
                    if (prev == null || !eventEquals(prev, event)) {
                        events.push(event)
                    }
                })
            })
        })

        return events
    }
}


