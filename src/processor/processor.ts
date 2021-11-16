import {Channel} from "../util/async"
import {Batch} from "./batch"
import {Hooks} from "./interfaces/hooks"
import {SubstrateBlock, SubstrateEvent} from "./interfaces/substrate"


export interface ProcessorOptions {
    name: string
    indexerUrl: string
    startBlock: number
    batchSize: number
    hooks: Hooks
}


interface BlockData {
    block: SubstrateBlock
    events: SubstrateEvent[]
}


interface ProcessingBatch extends Batch {
    blocks: BlockData[]
}


export class Processor {
    private batches = new Channel<ProcessingBatch>(2)

    constructor(private options: ProcessorOptions) {}

    private async ingest() {

    }

    run() {

    }
}


