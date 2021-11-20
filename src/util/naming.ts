import camelcase from "camelcase"

const CAMEL_CASE_CACHE: Record<string, string> = {}

export function getCamelCase(name: string): string {
    let cc = CAMEL_CASE_CACHE[name]
    if (cc == null) {
        cc = CAMEL_CASE_CACHE[name] = camelcase(name)
    }
    return cc
}
