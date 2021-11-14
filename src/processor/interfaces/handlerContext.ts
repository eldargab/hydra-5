import type {EntityManager} from "typeorm"
import type {MetadataRegistry} from "../../metadata/metadataRegistry"
import type {SubstrateBlock, SubstrateEvent} from "./substrate"


export interface Store extends EntityManager {}


export interface EventHandlerContext {
    store: Store
    block: SubstrateBlock
    event: SubstrateEvent
    metadataRegistry: MetadataRegistry
}
