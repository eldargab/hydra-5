import type {Bytes, Struct, U128, U32, U8, U8aFixed} from '@polkadot/types'
import type {ITuple} from '@polkadot/types/types'

export interface AccountId32 extends U8aFixed {}

export interface CandidateReceipt extends Struct {
  readonly descriptor: CandidateDescriptor
  readonly commitmentsHash: H256
}

export interface HeadData extends Bytes {}

export interface CoreIndex extends U32 {}

export interface GroupIndex extends U32 {}

export interface CandidateDescriptor extends Struct {
  readonly paraId: Id
  readonly relayParent: H256
  readonly collator: Public
  readonly persistedValidationDataHash: H256
  readonly povHash: H256
  readonly erasureRoot: H256
  readonly signature: Signature
  readonly paraHead: H256
  readonly validationCodeHash: ValidationCodeHash
}

export interface H256 extends U8aFixed {}

export interface Id extends U32 {}

export interface Public extends U8aFixed {}

export interface Signature extends U8aFixed {}

export interface ValidationCodeHash extends H256 {}
