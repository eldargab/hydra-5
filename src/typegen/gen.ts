import {Spec, SpecVersion, toQualifiedName} from "../metadata-old/base"
import type {OutDir} from "../util/out"
import {assertNotNull, def, groupBy} from "../util/util"
import {Event, eventEquals} from "./event"
import {Interfaces} from "./ifs"
import {Imports, POLKADOT_LIB} from "./imports"


export interface TypegenOptions {
    outDir: OutDir
    chainSpec: Spec[]
    events?: string[]
    calls?: string[]
}


export class Typegen {
    static generate(options: TypegenOptions): void {
        let typegen = new Typegen(options)
        typegen.generate()
    }

    constructor(private options: TypegenOptions) {}

    private generate() {
        this.generateEvent()
        this.interfaces().forEach((ifs, specVersion) => {
            if (ifs.isEmpty()) return
            let file = this.options.outDir.file(`v${specVersion}.ts`)
            ifs.generate(file)
            file.write()
        })
    }

    private generateEvent() {
        let out = this.options.outDir.file('events.ts')
        let interfaces = this.interfaces()
        let pallets = groupBy(this.events(), e => e.pallet)

        let imports = new Imports([POLKADOT_LIB])
        let ifsImports = new Set<SpecVersion>()

        out.line(`import assert from 'assert'`)
        out.lazy(() => imports.render())
        out.lazy(() => Array.from(ifsImports).map(version => `import * as v${version} from './v${version}'`))

        Array.from(pallets.keys()).sort().forEach(pallet => {
            let events = groupBy(assertNotNull(pallets.get(pallet)), e => e.name)
            events.forEach((versions, name) => {
                let qualifiedName = toQualifiedName(pallet, name)
                out.line()
                out.blockComment(versions[versions.length - 1].docs)
                out.block(`export class ${pallet}${name}Event`, () =>{
                    out.block(`constructor(private ctx: any)`, () => {
                        out.line(`assert(this.ctx.event.name === '${qualifiedName}')`)
                    })
                    versions.forEach((event, idx) => {
                        let version = event.spec.specVersion
                        let isLastVersion = versions.length === idx + 1
                        let ifs = assertNotNull(interfaces.get(version))
                        let unqualifiedType = ifs.genTuple(event.fields.map(f => f.type))
                        let type = ifs.qualify(unqualifiedType, 'v'+version, imports)
                        if (type !== unqualifiedType) {
                            ifsImports.add(version)
                        }
                        out.line()
                        if (isLastVersion) {
                            out.block(`get isLatest(): boolean`, () => {
                                out.line(`let specVersion = this.ctx.block.runtimeVersion.specVersion`)
                                out.line(`if (specVersion < ${version}) return false`)
                                out.line(`if (specVersion === ${version}) return true`)
                                out.line(`return this.ctx.metadataRegistry.checkEventCompatibility('${qualifiedName}', ${version}, specVersion)`)
                            })
                            out.line()
                            out.block(`get asLatest(): ${type}`, () => {
                                out.line(`let specVersion = this.ctx.block.runtimeVersion.specVersion`)
                                out.line(`return this.ctx.metadataRegistry.createEvent('${qualifiedName}', ${version}, specVersion, this.ctx.event.params)`)
                            })
                        } else {
                            out.block(`get isV${version}(): boolean`, () => {
                                out.line(`let specVersion = this.ctx.block.runtimeVersion.specVersion`)
                                out.line(`return specVersion >= ${version} && specVersion < ${versions[idx+1].spec.specVersion}`)
                            })
                            out.line()
                            out.block(`get asV${version}(): ${type}`, () => {
                                out.line(`assert(this.isV${version})`)
                                out.line(`let specVersion = this.ctx.block.runtimeVersion.specVersion`)
                                out.line(`return this.ctx.metadataRegistry.createEvent('${qualifiedName}', specVersion, specVersion, this.ctx.event.params)`)
                            })
                        }
                    })
                })
            })
        })

        out.write()
    }

    @def
    interfaces(): Map<SpecVersion, Interfaces> {
        let m = new Map<SpecVersion, Interfaces>()
        this.events().forEach(e => {
            let spec = e.spec
            if (m.has(spec.specVersion)) return
            m.set(spec.specVersion, new Interfaces(spec.metadata.asLatest))
        })
        return m
    }

    @def
    events(): Event[] {
        let events: Event[] = []

        this.options.chainSpec.forEach(spec => {
            let metadata = spec.metadata.asLatest
            metadata.pallets.forEach(pallet => {
                if (pallet.events.isNone) return
                let def = metadata.lookup.getSiType(pallet.events.unwrap().type).def
                def.asVariant.variants.forEach(v => {
                    let qualifiedName = toQualifiedName(pallet.name.toString(), v.name.toString())
                    if (!this.options.events?.includes(qualifiedName)) return
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
                        }),
                        docs: v.docs.map(line => line.toString())
                    }
                    let prev = findPrevEvent(events, event)
                    if (prev == null || !eventEquals(prev, event)) {
                        events.push(event)
                    }
                })
            })
        })

        return events
    }
}


function findPrevEvent(events: Event[], current: Event): Event | undefined {
    for (let i = events.length - 1; i >= 0; i--) {
        let prev = events[i]
        if (prev.pallet === current.pallet && prev.name === current.name) return prev
    }
    return undefined
}

