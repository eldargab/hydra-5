import {Output} from "../util/out"
import {assertNotNull} from "../util/util"
import {Batch} from "./batch"


export function buildBatchQuery(batch: Batch): string {
    let out = new Output()
    let start = batch.range.from
    let end = assertNotNull(batch.range.to)
    let notAllBlocksRequired = batch.pre.length == 0 && batch.post.length == 0
    let events = Object.keys(batch.events)

    let height = `{_gte: ${start} _lte: ${end}}}`
    let blockEvents = `{_or: [${events.map(name => `{event: {_contains}}`)}]}`

    out.block(`query`, () => {
        out.block(`blocks: substrate_block(where: {height: ${height}})`, () => {

        })
    })
    return out.toString()
}
