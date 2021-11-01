import * as primitiveClasses from '@polkadot/types/primitive'
import * as codecClasses from '@polkadot/types/codec'


const nativeTypes = new Set([
    ...Object.keys(primitiveClasses),
    ...Object.keys(codecClasses),
    'Codec',
    'Bytes',
    'Vec',
    'Struct',
    'Option',
    'Result'
])


const typesTypes = new Set([
    'ITuple'
])


export function isNativeType(name: string): boolean {
    return nativeTypes.has(name)
}


export function isReservedTypeName(name: string): boolean {
  return nativeTypes.has(name) || typesTypes.has(name)
}


export class Imports {
    private native = new Set<string>()
    private typesTypes = new Set<string>()

    use(name: string) {
        if (isNativeType(name)) {
            this.native.add(name)
        } else if (typesTypes.has(name)) {
            this.typesTypes.add(name)
        } else {
            throw new Error(`Can't resolve type ${name}`)
        }
    }

    render(): string[] {
        let lines: string[] = []
        render(lines, '@polkadot/types', this.native)
        render(lines, '@polkadot/types/types', this.typesTypes)
        return lines
    }
}

function render(lines: string[], module: string, imports: Set<string>): void {
    if (imports.size > 0) {
        lines.push(
            `import type {${Array.from(imports).sort().join(', ')}} from '${module}'`
        )
    }
}
