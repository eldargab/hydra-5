import {ApiPromise, WsProvider} from "@polkadot/api"


export async function kusama(): Promise<ApiPromise> {
    let provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    return await ApiPromise.create({provider})
}
