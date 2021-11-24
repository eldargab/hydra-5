import type {EntityManager} from "typeorm"
import type {MetadataRegistry} from "../../old/metadata-old/metadataRegistry"
import type {SubstrateBlock, SubstrateEvent} from "./substrate"


export interface Store extends EntityManager {}


export interface EventHandlerContext {
    metadataRegistry: MetadataRegistry
    store: Store
    block: SubstrateBlock
    event: SubstrateEvent
}


export interface EventHandler {
    (ctx: EventHandlerContext): Promise<void>
}


export interface BlockHandlerContext {
    metadataRegistry: MetadataRegistry
    store: Store
    block: SubstrateBlock
    events: SubstrateEvent[]
}


export interface BlockHandler {
    (ctx: BlockHandlerContext): Promise<void>
}
