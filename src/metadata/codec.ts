import assert from "assert"
import {Codec, Src, Ti} from "../scale"
import * as metadataDefinition from "./definition"
import {OldTypeRegistry} from "./old/types"


const {codec, type} = createScaleCodec()


export function decodeMetadata(data: string | Uint8Array): any {
    if (typeof data == 'string') {
        data = Buffer.from(data.slice(2), 'hex')
    }
    let src = new Src(data)
    let magic = src.u32()
    assert(magic === 0x6174656d, 'No magic number 0x6174656d at the start of data')
    let metadata = codec.decode(type, src)
    src.assertEOF()
    return metadata
}


function createScaleCodec(): {codec: Codec, type: Ti} {
    let registry = new OldTypeRegistry(metadataDefinition)
    let type = registry.use('Metadata')
    return {
        codec: new Codec(registry.getTypeRegistry()),
        type
    }
}
