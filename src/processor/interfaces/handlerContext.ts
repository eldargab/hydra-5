import type {EntityManager} from "typeorm"
import type {ChainDescription} from "../../metadata"
import type {SubstrateBlock, SubstrateEvent} from "./substrate"


export interface Store extends EntityManager {}


export interface EventHandlerContext {
    chainDescription: ChainDescription
    store: Store
    block: SubstrateBlock
    event: SubstrateEvent
}


export interface EventHandler {
    (ctx: EventHandlerContext): Promise<void>
}


export interface BlockHandlerContext {
    chainDescription: ChainDescription
    store: Store
    block: SubstrateBlock
    events: SubstrateEvent[]
}


export interface BlockHandler {
    (ctx: BlockHandlerContext): Promise<void>
}
