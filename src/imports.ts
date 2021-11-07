import * as primitiveClasses from '@polkadot/types/primitive'
import * as codecClasses from '@polkadot/types/codec'
import * as polkadotInterfaceDefinitions from '@polkadot/types/interfaces/definitions'


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


export const POLKADOT_LIB = {
    types: new Set(
        Object.entries(polkadotInterfaceDefinitions).flatMap((e) => Object.keys(e[1].types))
    ),
    module: '@polkadot/types/interfaces'
}


export function isNativeType(name: string): boolean {
    return nativeTypes.has(name)
}


export function isReservedTypeName(name: string): boolean {
  return nativeTypes.has(name) || typesTypes.has(name)
}


export interface Lib {
    types: Set<string>
    module: string
}


export class Imports {
    private libs: Lib[]
    private modules = new Map<string, Set<string>>()

    constructor(libs: Lib[] = []) {
        this.libs = [
            ...libs,
            {
                types: nativeTypes,
                module: '@polkadot/types'
            },
            {
                types: typesTypes,
                module: '@polkadot/types/types'
            }
        ]
    }

    use(name: string) {
        for (let i = 0; i < this.libs.length; i++) {
            let lib = this.libs[i]
            if (lib.types.has(name)) {
                let imports = this.modules.get(lib.module)
                if (imports == null) {
                    imports = new Set()
                    this.modules.set(lib.module, imports)
                }
                imports.add(name)
                return
            }
        }
        throw new Error(`Can't resolve type ${name}`)
    }

    render(): string[] {
        let modules = Array.from(this.modules.keys()).sort()
        return modules.map(m => {
            let imports = this.modules.get(m)!
            let names = Array.from(imports).sort()
            return `import type {${names.join(', ')}} from '${m}'`
        })
    }
}
