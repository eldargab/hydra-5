import * as types from "@polkadot/types/interfaces/definitions"
import * as fs from "fs"

let all: Record<string, any> = {}

for (let key in types) {
    Object.assign(all, (types as any)[key].types)
}

fs.writeFileSync('types.json', JSON.stringify(all, null, 2))
