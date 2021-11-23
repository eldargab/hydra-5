import assert from "assert"


export function arrayEquals<T>(a: T[], b: T[], eq?: (a: T, b: T) => boolean): boolean {
    if (a.length !== b.length) return false
    eq = eq || identity
    for (let i = 0; i < a.length; i++) {
        if (!eq(a[i], b[i])) return false
    }
    return true
}


function identity(a: unknown, b: unknown): boolean {
    return a === b
}


export function lowerCaseFirst(s: string): string {
    if (s) {
        return s[0].toLowerCase() + s.slice(1)
    } else {
        return s
    }
}


export function groupBy<T, G>(arr: T[], group: (t: T) => G): Map<G, T[]> {
    let grouping = new Map<G, T[]>()
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        let key = group(item)
        let g = grouping.get(key)
        if (g == null) {
            grouping.set(key, [item])
        } else {
            g.push(item)
        }
    }
    return grouping
}


export function assertNotNull<T>(val: T | undefined | null, msg?: string): T {
    assert(val != null, msg)
    return val
}


/**
 * Method decorator, which when applied caches the result of the first invocation and returns it
 * for all subsequent calls.
 */
export function def(proto: any, prop: string, d: PropertyDescriptor): PropertyDescriptor {
    let {value: fn, ...options} = d
    let is_ready = Symbol(prop + '_is_ready')
    let is_active = Symbol(prop + '_is_active')
    let cache = Symbol(prop + '_cache')

    let value = function(this: any) {
        if (this[is_ready]) return this[cache]
        if (this[is_active]) throw new Error('Cycle detected involving ' + prop)
        this[is_active] = true
        try {
            this[cache] = fn.call(this)
            this[is_ready] = true
        } finally {
            this[is_active] = false
        }
        return this[cache]
    } as any

    value._def_cache_symbol = cache

    return {value, ...options}
}


export function unexpectedCase(val?: unknown): Error {
    return new Error(val ? `Unexpected case: ${val}` : `Unexpected case`)
}
