import assert from "assert"
import {ChainDescription, getTypeHash, TypeKind, Variant} from "../metadata"
import {getCamelCase} from "../util/naming"
import {sha256} from "../util/sha256"


export type Result<T, E> = {
    __kind: 'Ok'
    value: T
} | {
    __kind: 'Err'
    value: E
}


export type QualifiedName = string


export interface EventDef extends Variant {
    pallet: string
}


const EVENTS_CACHE = new WeakMap<ChainDescription, Record<QualifiedName, EventDef>>()


export function getEvents(d: ChainDescription): Record<QualifiedName, EventDef> {
    let events = EVENTS_CACHE.get(d)
    if (events == null) {
        events = extractEvents(d)
        EVENTS_CACHE.set(d, events)
    }
    return events
}


function extractEvents(d: ChainDescription): Record<QualifiedName, EventDef> {
    let events: Record<string, EventDef> = {}
    let pallets = d.types[d.event]
    assert(pallets.kind == TypeKind.Variant)
    pallets.variants.forEach(palletVariant => {
        let section = getCamelCase(palletVariant.name)
        assert(palletVariant.fields.length == 1)
        let palletEvents = d.types[palletVariant.fields[0].type]
        assert(palletEvents.kind == TypeKind.Variant)
        palletEvents.variants.forEach(eventVariant => {
            let qualifiedName = `${section}.${eventVariant.name}`
            events[qualifiedName] = {
                ...eventVariant,
                pallet: palletVariant.name
            }
        })
    })
    return events
}


export function getEvent(d: ChainDescription, name: QualifiedName): EventDef {
    let events = getEvents(d)
    let def = events[name]
    if (def == null) {
        throw new Error(`Event ${name} not found`)
    }
    return def
}


const EVENTS_HASH_CACHE = new WeakMap<ChainDescription, Record<QualifiedName, string>>()


export function getEventHash(d: ChainDescription, name: QualifiedName): string {
    let hashes = EVENTS_HASH_CACHE.get(d)
    if (hashes == null) {
        hashes = {}
        EVENTS_HASH_CACHE.set(d, hashes)
    }
    let hash = hashes[name]
    if (hash == null) {
        hash = hashes[name] = computeEventHash(d, name)
    }
    return hash
}


function computeEventHash(d: ChainDescription, name: QualifiedName): string {
    let event = getEvent(d, name)
    let fields = event.fields.map(f => {
        return {
            name: f.name,
            type: getTypeHash(d.types, f.type)
        }
    })
    return sha256({
        name,
        fields
    })
}


export interface EventContext {
    chainDescription: ChainDescription
    block: {
        height: number
    }
    event: {
        name: string
    }
}


export function decodeEvent(ctx: EventContext): any {
    throw new Error('Not implemented')
}
