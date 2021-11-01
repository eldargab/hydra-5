import type {Text, Vec} from "@polkadot/types"
import type {MetadataLatest, SiField, SiLookupTypeId, SiType} from "@polkadot/types/interfaces"
import {stringCamelCase} from "@polkadot/util"
import assert from "assert"
import {Imports, isReservedTypeName} from "./imports"
import {Output} from "./out"


/**
 * Index of a type in metadata lookup table
 */
export type Ti = number


export class Interfaces {
    private names: Map<Ti, string>
    private generated: (string | undefined)[]
    private imports = new Imports()
    private queue: (() => void)[] = []

    constructor(
        private metadata: MetadataLatest,
        private out: Output
    ) {
        this.names = allocateNames(this.metadata)
        this.generated = new Array(getTypesCount(this.metadata))
        this.out.lazy(() => this.imports.render())
    }

    use(ti: Ti): string {
        let name = this.generated[ti]
        if (name != null) return name

        let type = this.metadata.lookup.getSiType(ti)
        let def = type.def

        if (def.isPrimitive) {
            name = def.asPrimitive.type
            if (name === 'Str') {
                name = 'Text'
            }
            this.imports.use(name)
        } else if (def.isCompact) {
            this.imports.use('Compact')
            let param = this.use(def.asCompact.type.toNumber())
            if (param == 'Null') { // FIXME: don't know what empty tuple means here
                param = 'any'
            }
            name = `Compact<${param}>`
        } else if (def.isTuple) {
            name = this.genTuple(def.asTuple)
        } else if (def.isSequence) {
            let item = this.use(def.asSequence.type.toNumber())
            if (item === 'U8') {
                this.imports.use('Bytes')
                name = 'Bytes'
            } else {
                this.imports.use('Vec')
                name = `Vec<${item}>`
            }
        } else if (def.isBitSequence) {
            this.imports.use('BitVec')
            name = 'BitVec'
        } else if (def.isArray) {
            let item = this.use(def.asArray.type.toNumber())
            if (item === 'U8') {
                this.imports.use('U8aFixed')
                name = 'U8aFixed'
            } else {
                this.imports.use('VecFixed')
                name = `VecFixed<${item}>`
            }
        } else if (def.isComposite) {
            let fields = def.asComposite.fields
            if (fields.length == 0) {
                this.imports.use('Null')
                name = 'Null'
            } else {
                name = this.getName(ti)
                this.queue.push(() => {
                    this.out.line()
                    this.docs(type.docs)
                    if (fields[0].name.isNone) {
                        this.out.line(`export interface ${name} extends ${this.genTuple(fields.map(f => f.type))} {}`)
                    } else {
                        this.printStruct(name!, fields)
                    }
                })
            }
        } else if (def.isVariant) {
            if (type.path.toString() === 'Option') {
                this.imports.use('Option')
                assert(type.params.length === 1)
                let param = this.use(type.params[0].type.unwrap().toNumber())
                name = `Option<${param}>`
            } else if (type.path.toString() === 'Result') {
                this.imports.use('Result')
                assert(type.params.length === 2)
                let rt = this.use(type.params[0].type.unwrap().toNumber())
                let et = this.use(type.params[1].type.unwrap().toNumber())
                name = `Result<${rt}, ${et}>`
            } else {
                name = this.getName(ti)
                this.queue.push(() => {
                    this.imports.use('Enum')
                    this.out.line()
                    this.docs(type.docs)
                    this.out.block(`export interface ${name} extends Enum`, () => {
                        def.asVariant.variants.forEach(v => {
                            this.docs(v.docs)
                            this.out.line(`readonly is${v.name.toString()}: boolean`)
                            if (v.fields.length > 0) {
                                let vt: string
                                if (v.fields[0].name.isNone) {
                                    vt = this.genTuple(v.fields.map(f => f.type))
                                } else {
                                    vt = name + v.name.toString()
                                    this.queue.push(() => {
                                        this.out.line()
                                        this.docs(v.docs)
                                        this.printStruct(vt, v.fields)
                                    })
                                }
                                this.out.line(`readonly as${v.name.toString()}: ${vt}`)
                            }
                        })
                    })
                })
            }
        } else {
            throw new Error(`Unsupported type: ${type.toString()}`)
        }

        return this.generated[ti] = name
    }

    private genTuple(types: SiLookupTypeId[]): string {
        switch(types.length) {
            case 0:
                this.imports.use('Null')
                return 'Null'
            case 1:
                return this.use(types[0].toNumber())
            default:
                this.imports.use('ITuple')
                return `ITuple<[${types.map(t => this.use(t.toNumber())).join(', ')}]>`
        }
    }

    private printStruct(name: string, fields: SiField[]): void {
        this.imports.use('Struct')
        this.out.block(`export interface ${name} extends Struct`, () => {
            fields.forEach(f => {
                let fieldName = stringCamelCase(f.name.unwrap().toString())
                let fieldType = this.use(f.type.toNumber())
                this.docs(f.docs)
                this.out.line(`readonly ${fieldName}: ${fieldType}`)
            })
        })
    }

    private getName(ti: Ti): string {
        let name = this.names.get(ti)
        assert(name != null, `Name was not allocated for type ${ti}`)
        return name
    }

    private docs(docs: Vec<Text>): void {
        this.out.blockComment(docs.map(line => line.toString()))
    }

    generate(): void {
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i]()
        }
    }
}


function getTypesCount(metadata: MetadataLatest): number {
    return metadata.lookup.types.length
}


/**
 * Ad-hoc way to name to types
 *
 * First the last component of item path is tried (the simple name). If there is a clash,
 * then the simple name will be assigned to the type with the most usages.
 * Other names will be mangled with `_${idx}` suffix
 */
function allocateNames(metadata: MetadataLatest): Map<Ti, string> {
    let usage = nameUsage(metadata)
    let refs = computeRefCounts(metadata)

    usage.forEach(list => list.sort((a, b) => refs[b] - refs[a]))

    let names = new Map<number, string>()

    for (let i = 0; i < getTypesCount(metadata); i++) {
        let type = metadata.lookup.getSiType(i)
        if (isNamedType(type)) {
            if (type.path.length === 0) {
                names.set(i, `Lookup_${i}`)
            } else {
                let name = getSimpleName(type)
                let owner = usage.get(name)?.[0]
                if (isReservedTypeName(name) || owner !== i) {
                    names.set(i, `${name}_${i}`)
                } else  {
                    names.set(i, name)
                }
            }
        }
    }

    return names
}


/**
 * Compute a mapping between simple names and actual types which want to have it
 */
function nameUsage(metadata: MetadataLatest): Map<string, Ti[]> {
    let names = new Map<string, Ti[]>()
    for (let i = 0; i < getTypesCount(metadata); i++) {
        let type = metadata.lookup.getSiType(i)
        if (isNamedType(type)) {
            let name = getSimpleName(type)
            let list = names.get(name)
            if (list == null) {
                list = []
                names.set(name, list)
            }
            list.push(i)
        }
    }
    return names
}


/**
 * Does `type` require a name allocation
 */
function isNamedType(type: SiType): boolean {
    return type.def.isComposite || type.def.isVariant
}


/**
 * Last component of a path, e.g. crate::foo::Balance -> Balance
 */
function getSimpleName(type: SiType): string {
    assert(type.path.length > 0)
    return type.path[type.path.length - 1].toString()
}


/**
 * For each type, compute a number of times it was referenced.
 *
 * This function is rough, as e.g. usage of Option<X> will not increase number of X usages,
 * but at the moment we don't expect this function to be very useful anyway...
 */
function computeRefCounts(metadata: MetadataLatest): number[] {
    let counts = new Array(getTypesCount(metadata)).fill(0)

    function inc(idx: { toNumber: () => number }): void {
        counts[idx.toNumber()] += 1
    }

    for (let i = 0; i < getTypesCount(metadata); i++) {
        let def = metadata.lookup.getSiType(i).def
        if (def.isCompact) {
            inc(def.asCompact.type)
        } else if (def.isArray) {
            inc(def.asArray.type)
        } else if (def.isTuple) {
            def.asTuple.forEach(inc)
        } else if (def.isComposite) {
            def.asComposite.fields.forEach(f => inc(f.type))
        } else if (def.isSequence) {
            inc(def.asSequence.type)
        }
    }

    return counts
}
