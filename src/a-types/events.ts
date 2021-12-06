import assert from 'assert'
import {decodeEvent, EventContext, getEventHash, Result} from './support'
import * as v9090 from './v9090'
import * as v9111 from './v9111'

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get isV1020(): boolean {
    let h = this.ctx.block.height
    return h <= 1375086
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get asV1020(): [Uint8Array, Uint8Array, bigint, bigint] {
    assert(this.isV1020)
    return decodeEvent(this.ctx)
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get isV1050(): boolean {
    let h = this.ctx.block.height
    return 1375086 < h && h <= 9625129
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get asV1050(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1050)
    return decodeEvent(this.ctx)
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 9625129 && getEventHash(this.ctx.chainDescription, 'balances.Transfer') === 'c8220781154f957e7df7e5862aeb87aff44c718af061d851cb42bbd5a257e04b'
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get asLatest(): [v9111.AccountId32, v9111.AccountId32, bigint] {
    assert(this.isLatest)
    return decodeEvent(this.ctx)
  }
}

export class ParaInclusionCandidateIncludedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'paraInclusion.CandidateIncluded')
  }

  /**
   *  A candidate was included. `[candidate, head_data]`
   */
  get isV9090(): boolean {
    let h = this.ctx.block.height
    return 8945245 < h && h <= 9625129
  }

  /**
   *  A candidate was included. `[candidate, head_data]`
   */
  get asV9090(): [v9090.CandidateReceipt, Uint8Array, number, number] {
    assert(this.isV9090)
    return decodeEvent(this.ctx)
  }

  /**
   * A candidate was included. `[candidate, head_data]`
   */
  get isLatest(): boolean {
    return this.ctx.block.height > 9625129 && getEventHash(this.ctx.chainDescription, 'paraInclusion.CandidateIncluded') === '941e646ea34059c7b48bde5ab905458675c9091e715c28e8b486d497b4682fb4'
  }

  /**
   * A candidate was included. `[candidate, head_data]`
   */
  get asLatest(): [v9111.V1CandidateReceipt, v9111.HeadData, v9111.V1CoreIndex, v9111.V1GroupIndex] {
    assert(this.isLatest)
    return decodeEvent(this.ctx)
  }
}
