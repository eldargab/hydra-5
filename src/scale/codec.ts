import {decode} from "./decode"
import {Src} from "./src"
import type {Ti, Type} from "./types"
import {normalizeTypes} from "./util"


export class Codec {
    private types: Type[]

    constructor(types: Type[]) {
        this.types = normalizeTypes(types)
    }

    decode(type: Ti, src: Src): any {
        return decode(this.types, type, src)
    }

    decodeBinary(type: Ti, data: string | Uint8Array): any {
        if (typeof data == 'string') {
            data = Buffer.from(data.slice(2), 'hex')
        }
        let src = new Src(data)
        let val = this.decode(type, src)
        src.assertEOF()
        return val
    }
}
