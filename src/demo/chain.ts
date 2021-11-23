import {ApiPromise, WsProvider} from "@polkadot/api"


export const KUSAMA_INDEXER = 'https://kusama.indexer.gc.subsquid.io/v4/graphql'


export async function kusama(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    return await ApiPromise.create({provider})
}
