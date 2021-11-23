import assert from "assert"
import {decode} from "./decode"
import {Src} from "./src"
import type {Registry, Ti, Type} from "./types"
import {toRegistry} from "./util"


export class Codec {
    private registry: Registry

    constructor(types: Type[]) {
        this.registry = toRegistry(types)
    }

    decode(type: Ti, src: Src): any {
        return decode(this.registry, type, src)
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
