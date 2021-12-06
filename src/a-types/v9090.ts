
export interface CandidateReceipt {
  descriptor: CandidateDescriptor
  commitmentsHash: Uint8Array
}

export interface CandidateDescriptor {
  paraId: number
  relayParent: Uint8Array
  collatorId: Uint8Array
  persistedValidationDataHash: Uint8Array
  povHash: Uint8Array
  erasureRoot: Uint8Array
  signature: Uint8Array
  paraHead: Uint8Array
  validationCodeHash: Uint8Array
}
