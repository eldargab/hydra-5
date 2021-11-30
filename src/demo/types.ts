import * as definitions from "@polkadot/types/interfaces/definitions"
import * as fs from "fs"

let all: Record<string, any> = {
    GenericAccountId: '[u8; 32]',
    GenericAccountIndex: 'u32',
    GenericConsensusEngineId: '[u8; 4]',
    GenericMultiAddress: {
        _enum: {
            Id: 'AccountId',
            Index: 'Compact<AccountIndex>',
            Raw: 'Bytes',
            Address32: 'H256',
            Address20: 'H160'
        }
    },
    GenericVote: '[u8; 8]',
    StorageKey: 'Bytes',
    Data: {
        _enum: {
            None: 'Null',
            Raw: 'Bytes',
            BlakeTwo256: 'H256',
            Sha256: 'H256',
            Keccak256: 'H256',
            ShaThree256: 'H256'
        }
    }
}

let modules: any = definitions

for (let name in modules) {
    if (name == 'metadata') continue
    let types = modules[name]?.types
    for (let key in types) {
        let def = types[key]
        if (def && typeof def == 'object') {
            let {_alias, ...rest} = def
            def = rest
        }
        all[key] = def
    }
}

fs.writeFileSync(
    'src/metadata/old/definitions/substrate.ts',
    'export const types = ' + JSON.stringify(all, null, 2)
)
