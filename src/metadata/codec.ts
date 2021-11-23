import assert from "assert"
import {decode} from "../scale/decode"
import {Src} from "../scale/src"
import type {Ti, Type} from "../scale/types"
import * as metadataDefinition from "./definition"
import {OldTypeRegistry} from "./old/types"


const SCALE = createScaleType()


export function decodeMetadata(data: string | Uint8Array): any {
    if (typeof data == 'string') {
        data = Buffer.from(data.slice(2), 'hex')
    }
    let src = new Src(data)
    let magic = src.u32()
    assert(magic === 0x6174656d, 'No magic number 0x6174656d at the start of data')
    return decode(SCALE.types, SCALE.ti, src)
}


function createScaleType(): {types: Type[], ti: Ti} {
    let registry = new OldTypeRegistry(metadataDefinition)
    let ti = registry.use('Metadata')
    return {
        types: registry.scaleTypes,
        ti
    }
}
