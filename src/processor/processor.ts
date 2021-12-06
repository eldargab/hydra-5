import {assertNotNull} from "../util/util"
import {EventHandler} from "./interfaces/handlerContext"
import {Range} from "../util/range"
import {Hooks, QualifiedName} from "./interfaces/hooks"


export class Processor {
    private indexer = process.env.INDEXER_URL || ''
    private hooks: Hooks = {pre: [], post: [], event: []}

    constructor(private name: string) {}

    setIndexer(url: string): void {
        this.indexer = url
    }

    addEventHandler(eventName: QualifiedName, fn: EventHandler): void
    addEventHandler(eventName: QualifiedName, blockRange: Range, fn: EventHandler): void
    addEventHandler(eventName: QualifiedName, blockRangeOrHandler: Range | EventHandler, fn?: EventHandler): void {
        if (typeof blockRangeOrHandler === 'function') {
            this.hooks.event.push({
                event: eventName,
                handler: blockRangeOrHandler
            })
        } else {
            this.hooks.event.push({
                event: eventName,
                range: blockRangeOrHandler,
                handler: assertNotNull(fn)
            })
        }
    }

    run(): void {

    }
}
