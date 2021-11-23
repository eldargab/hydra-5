import {QualifiedName} from "../../metadata-old/base"
import {Range} from "../../util/range"
import {BlockHandler, EventHandler} from "./handlerContext"


export interface BlockHook {
    range?: Range
    handler: BlockHandler
}


export interface EventHook {
    event: QualifiedName
    range?: Range
    handler: EventHandler
}


export interface Hooks {
    pre: BlockHook[]
    post: BlockHook[]
    event: EventHook[]
}
