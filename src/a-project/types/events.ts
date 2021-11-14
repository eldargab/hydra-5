import assert from 'assert'
import type {Null, U128} from '@polkadot/types'
import type {AccountId, Balance, ElectionCompute} from '@polkadot/types/interfaces'
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
 * Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
 */
export class BalancesDepositEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'balances.Deposit')
  }

  get isV1032(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1032 && specVersion < 9111
  }

  get asV1032(): ITuple<[AccountId, Balance]> {
    assert(this.isV1032)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('balances.Deposit', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('balances.Deposit', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('balances.Deposit', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 *  The staker has been rewarded by this amount. AccountId is controller account.
 */
export class StakingRewardEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Reward')
  }

  get isV1020(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1020 && specVersion < 1050
  }

  get asV1020(): ITuple<[Balance, Balance]> {
    assert(this.isV1020)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Reward', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 1050) return false
    if (specVersion === 1050) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Reward', 1050, specVersion)
  }

  get asLatest(): ITuple<[AccountId, Balance]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Reward', 1050, specVersion, this.ctx.event.params)
  }
}

/**
 *  One validator (and its nominators) has been slashed by the given amount.
 */
export class StakingSlashEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Slash')
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 1020) return false
    if (specVersion === 1020) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Slash', 1020, specVersion)
  }

  get asLatest(): ITuple<[AccountId, Balance]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Slash', 1020, specVersion, this.ctx.event.params)
  }
}

/**
 * An account has bonded this amount. \[stash, amount\]
 * 
 * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
 * it will not be emitted for staking rewards when they are added to stake.
 */
export class StakingBondedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Bonded')
  }

  get isV1051(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1051 && specVersion < 9111
  }

  get asV1051(): ITuple<[AccountId, Balance]> {
    assert(this.isV1051)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Bonded', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Bonded', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Bonded', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 * An account has unbonded this amount. \[stash, amount\]
 */
export class StakingUnbondedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Unbonded')
  }

  get isV1051(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1051 && specVersion < 9111
  }

  get asV1051(): ITuple<[AccountId, Balance]> {
    assert(this.isV1051)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Unbonded', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Unbonded', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Unbonded', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 *  A new set of stakers was elected.
 */
export class StakingStakingElectionEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.StakingElection')
  }

  get isV1058(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1058 && specVersion < 2030
  }

  get asV1058(): ElectionCompute {
    assert(this.isV1058)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.StakingElection', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 2030) return false
    if (specVersion === 2030) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.StakingElection', 2030, specVersion)
  }

  get asLatest(): Null {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.StakingElection', 2030, specVersion, this.ctx.event.params)
  }
}

/**
 * The nominator has been rewarded by this amount. \[stash, amount\]
 */
export class StakingRewardedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Rewarded')
  }

  get isV9090(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 9090 && specVersion < 9111
  }

  get asV9090(): ITuple<[AccountId, Balance]> {
    assert(this.isV9090)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Rewarded', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Rewarded', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Rewarded', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 * One validator (and its nominators) has been slashed by the given amount.
 * \[validator, amount\]
 */
export class StakingSlashedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.Slashed')
  }

  get isV9090(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 9090 && specVersion < 9111
  }

  get asV9090(): ITuple<[AccountId, Balance]> {
    assert(this.isV9090)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Slashed', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.Slashed', 9111, specVersion)
  }

  get asLatest(): ITuple<[v9111.AccountId32, U128]> {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.Slashed', 9111, specVersion, this.ctx.event.params)
  }
}

/**
 *  A new set of stakers was elected.
 */
export class StakingStakersElectedEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'staking.StakersElected')
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9090) return false
    if (specVersion === 9090) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('staking.StakersElected', 9090, specVersion)
  }

  get asLatest(): Null {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('staking.StakersElected', 9090, specVersion, this.ctx.event.params)
  }
}

/**
 * Some funds have been deposited. \[deposit\]
 */
export class TreasuryDepositEvent {
  constructor(private ctx: any) {
    assert(this.ctx.event.name === 'treasury.Deposit')
  }

  get isV1020(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return specVersion >= 1020 && specVersion < 9111
  }

  get asV1020(): Balance {
    assert(this.isV1020)
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('treasury.Deposit', specVersion, specVersion, this.ctx.event.params)
  }

  get isLatest(): boolean {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    if (specVersion < 9111) return false
    if (specVersion === 9111) return true
    return this.ctx.metadataRegistry.checkEventCompatibility('treasury.Deposit', 9111, specVersion)
  }

  get asLatest(): U128 {
    let specVersion = this.ctx.block.runtimeVersion.specVersion
    return this.ctx.metadataRegistry.createEvent('treasury.Deposit', 9111, specVersion, this.ctx.event.params)
  }
}
