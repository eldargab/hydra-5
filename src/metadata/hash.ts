import {MetadataLatest} from "@polkadot/types/interfaces"
import assert from "assert"
import {sha256} from "../util/sha256"
import {getTypesCount, Ti} from "./base"


const HASHERS = new WeakMap<MetadataLatest, TypeHasher>()


export function getTypeHasher(metadata: MetadataLatest): TypeHasher {
    let hasher = HASHERS.get(metadata)
    if (hasher == null) {
        hasher = new TypeHasher(metadata)
        HASHERS.set(metadata, hasher)
    }
    return hasher
}


/**
 * Get a strong hash of substrate type, which can be used for equality derivation
 */
export function getTypeHash(metadata: MetadataLatest, type: Ti): string {
    return getTypeHasher(metadata).getHash(type)
}

/**
 * https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm
 */
interface HashNode {
    index: number
    lowIndex: number
    onStack: boolean
    hash: string
    component?: number
}

/**
 * Computes hashes of substrate types for the purpose of equality derivation.
 *
 * Substrate types form a cyclic directed graph.
 * Two types are equal when their depth-first traversal trees are equal.
 * Inline with equality, we define a type hash to be a merkel hash of it's depth-first traversal.
 *
 * Note, that unlike a classic tree case we might need
 * to visit mutually recursive type nodes more than once.
 *
 * Naive approach of performing a depth-first traversal for each node might not work,
 * as we typically have around 10^3 nodes in a graph. This is on a verge of being slow.
 *
 * Hence, the following procedure:
 *  1. We embed Tarjan's strongly connected components algorithm in our hash computation to discover and
 *  persist information about strongly connected components.
 *  2. For each strongly connected component, we cache the resulting hash per entry point.
 *
 * This allows us to visit non-mutually recursive types only once and makes the overall procedure
 * quadratic only on the size of a maximal strongly connected component, which practically should not be big.
 */
export class TypeHasher {
    private cache: string[]

    private index = 1
    private nodes: (HashNode | undefined)[]
    private stack: Ti[] = []

    constructor(private metadata: MetadataLatest) {
        this.cache = new Array(getTypesCount(metadata)).fill('')
        this.nodes = new Array(getTypesCount(metadata))
    }

    getHash(type: Ti): string {
        let hash = this.cache[type]
        if (hash) return hash
        return this.hash(type, { // dummy root node
            index: 0,
            lowIndex: 0,
            onStack: false,
            hash: '',
            component: 0
        })
    }

    private hash(ti: Ti, parent: HashNode): string {
        let node = this.nodes[ti]
        if (node) {
            // We already visited this node before, which could happen because:
            // 1. We visited it during a previous traversal
            // 2. We visited it during a current traversal
            if (node.onStack) {
                // This is certainly a current traversal,
                parent.lowIndex = Math.min(parent.lowIndex, node.index)
                return node.hash
            }
            if (node.hash) {
                // This is a current traversal.
                // Parent and node belong to the same component.
                // In all other cases `node.hash` is empty.
                return node.hash
            }
            // This is a previous traversal, or we already exited
            // the strongly connected component of a `node`.
            assert(node.component != null) // In any case component information must be available.
            if (node.component !== parent.component) {
                // We are entering the strongly connected component.
                // We can return a hash right away if we entered it via this node before.
                let hash = this.cache[ti]
                if (hash) return hash
            }
            // Otherwise perform a regular Tarjan's visit as nothing happened.
        }
        node = {
            index: this.index,
            lowIndex: this.index,
            onStack: true,
            hash: '',
            component: node?.component
        }
        this.index += 1
        this.nodes[ti] = node
        this.stack.push(ti)
        let hash = node.hash = sha256(this.makeHash(ti, node))
        if (node.index == node.lowIndex) {
            let n
            do {
                n = this.nodes[this.stack.pop()!]!
                n.onStack = false
                n.component = node.index
                n.hash = ''
            } while (n !== node)
            this.cache[ti] = hash
        } else {
            parent.lowIndex = Math.min(parent.lowIndex, node.lowIndex)
        }
        return hash
    }

    private makeHash(ti: Ti, parent: HashNode): object {
        let type = this.metadata.lookup.getSiType(ti)
        let def = type.def
        if (def.isPrimitive) {
            return {
                primitive: def.asPrimitive.type
            }
        }
        if (def.isCompact) {
            return {
                compact: this.hash(def.asCompact.type.toNumber(), parent)
            }
        }
        if (def.isSequence) {
            return {
                sequence: this.hash(def.asSequence.type.toNumber(), parent)
            }
        }
        if (def.isArray) {
            let array = def.asArray
            return {
                array: {
                    len: array.len,
                    type: this.hash(array.type.toNumber(), parent)
                }
            }
        }
        if (def.isBitSequence) {
            let seq = def.asBitSequence
            return {
                bitSequence: {
                    bitOrderType: this.hash(seq.bitOrderType.toNumber(), parent),
                    bitStoreType: this.hash(seq.bitStoreType.toNumber(), parent)
                }
            }
        }
        if (def.isTuple) {
            return {
                tuple: def.asTuple.map(t => this.hash(t.toNumber(), parent))
            }
        }
        if (def.isComposite) {
            let desc: any = {}
            def.asComposite.fields.forEach((f, idx) => {
                let name = f.name.isSome ? f.name.unwrap().toString() : idx
                desc[name] = this.hash(f.type.toNumber(), parent)
            })
            return {composite: desc}
        }
        if (def.isVariant) {
            let desc: any = {}
            def.asVariant.variants.forEach(v => {
                desc[v.name.toString()] = v.fields.map((f, idx) => {
                    let name = f.name.isSome ? f.name.unwrap().toString() : idx
                    return {
                        name,
                        type: this.hash(f.type.toNumber(), parent)
                    }
                })
            })
            return {variant: desc}
        }
        if (def.isHistoricMetaCompat) {
            return {historic: def.asHistoricMetaCompat.toString()}
        }
        throw new Error(`Unsupported type: ${def.toString()}`)
    }
}
