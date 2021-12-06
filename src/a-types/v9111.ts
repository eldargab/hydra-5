
export type AccountId32 = Uint8Array

export interface V1CandidateReceipt {
  descriptor: V1CandidateDescriptor
  commitmentsHash: H256
}

export type HeadData = Uint8Array

export type V1CoreIndex = number

export type V1GroupIndex = number

export interface V1CandidateDescriptor {
  paraId: Id
  relayParent: H256
  collator: V0Public
  persistedValidationDataHash: H256
  povHash: H256
  erasureRoot: H256
  signature: V0Signature
  paraHead: H256
  validationCodeHash: ValidationCodeHash
}

export type H256 = Uint8Array

export type Id = number

export type V0Public = Uint8Array

export type V0Signature = Uint8Array

export type ValidationCodeHash = H256
