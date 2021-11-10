
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
