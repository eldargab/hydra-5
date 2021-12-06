import assert from "assert"
import {
    ChainDescription,
    decodeMetadata,
    getChainDescriptionFromMetadata,
    OldTypesBundle,
    SpecVersion
} from "../metadata"
import {ChainVersion} from "../metadata-explorer"
import {getTypesFromBundle} from "../metadata/old/typesBundle"
import {OutDir} from "../util/out"
import {def, groupBy} from "../util/util"
import {Interfaces} from "./ifs"
import {EventDef, getEventHash, getEvents, QualifiedName} from "./support"


interface VersionDescription extends ChainDescription {
    specVersion: SpecVersion
    blockNumber: number
}


interface Event {
    name: QualifiedName
    def: EventDef
    chainVersion: VersionDescription
}


export interface TypegenOptions {
    outDir: OutDir
    chain: ChainVersion[]
    typesBundle?: OldTypesBundle
    events?: string[]
    calls?: string[]
}


export class Typegen {
    static generate(options: TypegenOptions): void {
        new Typegen(options).generate()
    }

    private interfaces = new Map<SpecVersion, Interfaces>()

    constructor(private options: TypegenOptions) {}

    generate(): void {
        this.generateEvents()
        this.interfaces.forEach((ifs, specVersion) => {
            if (ifs.isEmpty()) return
            let file = this.options.outDir.file(`v${specVersion}.ts`)
            ifs.generate(file)
            file.write()
        })
        this.options.outDir.add('support.ts', [__dirname, '../../resource/typegen/support.ts.txt'])
    }

    generateEvents(): void {
        let out = this.options.outDir.file('events.ts')
        let events = this.events()
        let names = Array.from(events.keys()).sort()
        let importedInterfaces = new Set<SpecVersion>()

        out.line(`import assert from 'assert'`)
        out.line(`import {decodeEvent, EventContext, getEventHash, Result} from './support'`)
        out.lazy(() => Array.from(importedInterfaces).sort().map(v => `import * as v${v} from './v${v}'`))
        names.forEach(name => {
            let versions = events.get(name)!
            let {def: {pallet, name: unqualifiedName}} = versions[0]
            out.line()
            out.block(`export class ${pallet}${unqualifiedName}Event`, () => {
                out.block(`constructor(private ctx: EventContext)`, () => {
                    out.line(`assert(this.ctx.event.name === '${name}')`)
                })
                versions.forEach((version, idx) => {
                    let isLatest = versions.length === idx + 1
                    let v = version.chainVersion.specVersion
                    let ifs = this.getInterface(v)
                    let unqualifiedTypeExp = ifs.makeTuple(version.def.fields.map(f => f.type))
                    let typeExp = ifs.qualify('v'+v, unqualifiedTypeExp)
                    if (typeExp != unqualifiedTypeExp) {
                        importedInterfaces.add(v)
                    }
                    out.line()
                    if (isLatest) {
                        out.blockComment(version.def.docs)
                        out.block(`get isLatest(): boolean`, () => {
                            let hash = getEventHash(version.chainVersion, name)
                            let conditions = [
                                `getEventHash(this.ctx.chainDescription, '${name}') === '${hash}'`
                            ]
                            let begHeight = version.chainVersion.blockNumber
                            if (begHeight > 0) {
                                conditions.unshift(`this.ctx.block.height > ${begHeight}`)
                            }
                            out.line(`return ${conditions.join(' && ')}`)
                        })
                        out.line()
                        out.blockComment(version.def.docs)
                        out.block(`get asLatest(): ${typeExp}`, () => {
                            out.line(`assert(this.isLatest)`)
                            out.line(`return decodeEvent(this.ctx)`)
                        })
                    } else {
                        out.blockComment(version.def.docs)
                        out.block(`get isV${v}(): boolean`, () => {
                            let begHeight = version.chainVersion.blockNumber
                            let endHeight = versions[idx + 1].chainVersion.blockNumber
                            out.line(`let h = this.ctx.block.height`)
                            if (begHeight == 0) {
                                out.line(`return h <= ${endHeight}`)
                            } else {
                                out.line(`return ${begHeight} < h && h <= ${endHeight}`)
                            }
                        })
                        out.line()
                        out.blockComment(version.def.docs)
                        out.block(`get asV${v}(): ${typeExp}`, () => {
                            out.line(`assert(this.isV${v})`)
                            out.line(`return decodeEvent(this.ctx)`)
                        })
                    }
                })
            })
        })
        out.write()
    }

    /**
     * A mapping between qualified event name and list of unique versions
     */
    @def
    events(): Map<QualifiedName, Event[]> {
        if (!this.options.events?.length) return new Map()
        let requested = new Set(this.options.events)
        let list = this.chain().flatMap(chainVersion => {
            let events = getEvents(chainVersion)
            return Object.entries(events).map(([name, def]) => {
                return {name, def, chainVersion}
            })
        })
        let m = groupBy(list, e => e.name)
        requested.forEach(name => {
            if (!m.has(name)) {
                throw new Error(`Event ${name} is not defined in the chain`)
            }
        })
        m.forEach((versions, name) => {
            if (requested.has(name)) {
                versions.sort((a, b) => a.chainVersion.blockNumber - b.chainVersion.blockNumber)
                let unique: Event[] = []
                versions.forEach(v => {
                    let prev = unique.length ? unique[unique.length - 1] : undefined
                    if (prev && getEventHash(v.chainVersion, name) == getEventHash(prev.chainVersion, name)) {
                        // use the latest definition, but set specVersion and blockNumber of a previous one
                        // TODO
                    } else {
                        unique.push(v)
                    }
                })
                m.set(name, unique)
            } else {
                m.delete(name)
            }
        })
        return m
    }

    @def
    chain(): VersionDescription[] {
        return this.options.chain.map(v => {
            let metadata = decodeMetadata(v.metadata)
            let oldTypes = this.options.typesBundle && getTypesFromBundle(this.options.typesBundle, v.specVersion)
            let d = getChainDescriptionFromMetadata(metadata, oldTypes)
            return {
                specVersion: v.specVersion,
                blockNumber: v.blockNumber,
                ...d
            }
        }).sort((a, b) => a.blockNumber - b.blockNumber)
    }

    getInterface(specVersion: SpecVersion): Interfaces {
        let ifs = this.interfaces.get(specVersion)
        if (ifs) return ifs
        let d = this.chain().find(v => v.specVersion == specVersion)
        assert(d != null)
        ifs = new Interfaces(d.types)
        this.interfaces.set(specVersion, ifs)
        return ifs
    }
}
