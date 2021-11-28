import * as types from "@polkadot/types/interfaces/definitions"
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

for (let key in types) {
    Object.assign(all, (types as any)[key].types)
}

fs.writeFileSync('types.json', JSON.stringify(all, null, 2))
