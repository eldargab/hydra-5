import assert from "assert"
import {Channel} from "../util/async"
import {indexerRequest} from "../util/indexer"
import {Output} from "../util/out"
import {Range} from "../util/range"
import {Batch, createBatches} from "./batch"
import {Hooks} from "./interfaces/hooks"
import {SubstrateBlock, SubstrateEvent} from "./interfaces/substrate"


export interface BlockData {
    block: SubstrateBlock
    events: SubstrateEvent[]
}


export interface DataBatch extends Batch {
    blocks: BlockData[]
}


export interface IndexerStatus {
    indexerHeight: number
    chainHeight: number
}


export interface IngestOptions {
    indexer: string
    indexerPullTimeoutMS?: number
    range: Range
    batchSize: number
    hooks: Hooks
}


export class Ingest {
    private out = new Channel<DataBatch>(2)
    private aborted = false
    private indexerHeight = -1

    constructor(private options: IngestOptions) {
    }

    private async loop(): Promise<void> {
        let batches = createBatches(this.options.hooks, this.options.range)
        let batch = batches.shift()
        while (batch) {

        }
    }

    private async batchFetch(batch: Batch) {
        let from = batch.range.from
        let indexerHeight = await this.waitIndexerForHeight(from)
        let to = Math.min(indexerHeight, batch.range.to ?? Infinity)
        assert(from <= to)

        let limit = this.options.batchSize
        let events = Object.keys(batch.events)
        let notAllBlocksRequired = batch.pre.length == 0 && batch.post.length == 0

        // filters
        let height = `height: {_gte: ${from}, _lte: ${to}}`

        let where: string
        if (notAllBlocksRequired) {
            let blockEvents = events.map(name => `events: {_contains: [{name: "${name}"}]}`)
            if (blockEvents.length > 1) {
                where = `{_and: [{${height}}, {_or: [${blockEvents.map(f => `{${f}}`).join(', ')}]}]}`
            } else {
                assert(blockEvents.length == 1)
                where = `{${height} ${blockEvents[0]}}`
            }
        } else {
            where = `{${height}}`
        }

        let eventWhere = ''
        if (events.length > 0) {
            eventWhere = `where: {name: {_in: [${events.map(name => `"${name}"`)}]}}`
        }

        let q = new Output()
        q.block(`query`, () => {
            q.block(`substrate_block(limit: ${limit} order_by: {height: asc} where: ${where})`, () => {
                q.line('id')
                q.line('hash')
                q.line('height')
                q.line('timestamp')
                q.line('parentHash')
                q.line('stateRoot')
                q.line('extrinsicsRoot')
                q.line('runtimeVersion')
                q.line('lastRuntimeUpgrade')
                q.line('events')
                q.line('extrinsics')
                q.line()
                q.block(`substrate_events(${eventWhere})`, () => {
                    q.line('id')
                    q.line('name')
                    q.line('method')
                    q.line('section')
                    q.line('params')
                    q.line('indexInBlock')
                    q.line('blockNumber')
                    q.line('blockTimestamp')
                    // q.block('extrinsic', () => {
                    //     q.line('id')
                    //     q.line('name')
                    //     q.line('method')
                    //     q.line('section')
                    //     q.line('versionInfo')
                    // })
                })
            })
        })

        let data = await this.indexerRequest(q.toString())
    }

    private async waitIndexerForHeight(minimumHeight: number): Promise<number> {
        while (this.indexerHeight < minimumHeight) {
            this.indexerHeight = Math.max(this.indexerHeight, await this.fetchIndexerHeight())
            if (this.indexerHeight >= minimumHeight) {
                return this.indexerHeight
            } else {
                await new Promise(resolve => {
                    setTimeout(resolve, this.options.indexerPullTimeoutMS || 5000)
                })
            }
        }
        return this.indexerHeight
    }

    private fetchIndexerHeight(): Promise<number> {
        return this.indexerRequest(`
            query {
                indexerStatus {
                    head
                }
            }
        `).then((res: any) => res.indexerStatus.head)
    }

    private indexerRequest<T>(query: string): Promise<T> {
        return indexerRequest(this.options.indexer, query)
    }
}

