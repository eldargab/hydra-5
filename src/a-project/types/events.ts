import assert from 'assert'
import type {U128} from '@polkadot/types'
import type {AccountId, Balance, CandidateReceipt, CoreIndex, GroupIndex, HeadData} from '@polkadot/types/interfaces'
import type {ITuple} from '@polkadot/types/types'
import * as v9111 from './v9111'

/**
 * Transfer succeeded. \[from, to, value\]
 */
export class BalancesTransferEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  get isV1020(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1020 && specVersion < 1050
  }

  get asV1020(): ITuple<[AccountId, AccountId, Balance, Balance]> {
    assert(this.isV1020)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('balances.Transfer', specVersion, specVersion, this.ctx.event.params)
  }

  get isV1050(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1050 && specVersion < 9111
  }

  get asV1050(): ITuple<[AccountId, AccountId, Balance]> {
    assert(this.isV1050)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('balances.Transfer', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('balances.Transfer', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('balances.Transfer', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 * A candidate was included. `[candidate, head_data]`
 */
export class ParaInclusionCandidateIncludedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'paraInclusion.CandidateIncluded')
  }

  get isV9090(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 9090 && specVersion < 9111
  }

  get asV9090(): ITuple<[CandidateReceipt, HeadData, CoreIndex, GroupIndex]> {
    assert(this.isV9090)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('paraInclusion.CandidateIncluded', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('paraInclusion.CandidateIncluded', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.CandidateReceipt, v9111.HeadData, v9111.CoreIndex, v9111.GroupIndex]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('paraInclusion.CandidateIncluded', 9111, specVersion, this.ctx.event.params)
  }
}
