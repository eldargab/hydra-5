import type {Bool, Bytes, Compact, Enum, Null, Option, Result, Struct, U128, U16, U32, U64, U8, U8aFixed, Vec} from '@polkadot/types'
import type {ITuple} from '@polkadot/types/types'

export interface DispatchInfo extends Struct {
  readonly weight: U64
  readonly class: DispatchClass
  readonly paysFee: Pays
}

export interface DispatchError extends Enum {
  readonly isOther: boolean
  readonly isCannotLookup: boolean
  readonly isBadOrigin: boolean
  readonly isModule: boolean
  readonly asModule: DispatchErrorModule
  readonly isConsumerRemaining: boolean
  readonly isNoProviders: boolean
  readonly isToken: boolean
  readonly asToken: TokenError
  readonly isArithmetic: boolean
  readonly asArithmetic: ArithmeticError
}

export interface AccountId32 extends U8aFixed {}

export interface H256 extends U8aFixed {}

export interface BalanceStatus extends Enum {
  readonly isFree: boolean
  readonly isReserved: boolean
}

export interface Public extends U8aFixed {}

export interface Public extends U8aFixed {}

export interface Exposure extends Struct {
  readonly total: Compact<U128>
  readonly own: Compact<U128>
  readonly others: Vec<IndividualExposure>
}

export interface VoteThreshold extends Enum {
  readonly isSuperMajorityApprove: boolean
  readonly isSuperMajorityAgainst: boolean
  readonly isSimpleMajority: boolean
}

export interface EthereumAddress extends U8aFixed {}

export interface ProxyType extends Enum {
  readonly isAny: boolean
  readonly isNonTransfer: boolean
  readonly isGovernance: boolean
  readonly isStaking: boolean
  readonly isIdentityJudgement: boolean
  readonly isCancelProxy: boolean
  readonly isAuction: boolean
}

export interface Timepoint extends Struct {
  readonly height: U32
  readonly index: U32
}

export interface ElectionCompute extends Enum {
  readonly isOnChain: boolean
  readonly isSigned: boolean
  readonly isUnsigned: boolean
  readonly isFallback: boolean
  readonly isEmergency: boolean
}

export interface CandidateReceipt extends Struct {
  readonly descriptor: CandidateDescriptor
  readonly commitmentsHash: H256
}

export interface HeadData extends Bytes {}

export interface CoreIndex extends U32 {}

export interface GroupIndex extends U32 {}

export interface Id extends U32 {}

export interface Outcome extends Enum {
  readonly isComplete: boolean
  readonly asComplete: U64
  readonly isIncomplete: boolean
  readonly asIncomplete: ITuple<[U64, ErrorV2]>
  readonly isError: boolean
  readonly asError: ErrorV2
}

export interface HrmpChannelId extends Struct {
  readonly sender: Id
  readonly recipient: Id
}

export interface MultiLocationV1 extends Struct {
  readonly parents: U8
  readonly interior: Junctions
}

export interface XcmV2 extends Vec<InstructionV2> {}

export interface ResponseV2 extends Enum {
  readonly isNull: boolean
  readonly isAssets: boolean
  readonly asAssets: MultiAssets
  readonly isExecutionResult: boolean
  readonly asExecutionResult: Option<ITuple<[U32, ErrorV2]>>
  readonly isVersion: boolean
  readonly asVersion: U32
}

export interface VersionedMultiAssets extends Enum {
  readonly isV0: boolean
  readonly asV0: Vec<MultiAssetV0>
  readonly isV1: boolean
  readonly asV1: MultiAssets
}

export interface ErrorV2 extends Enum {
  readonly isOverflow: boolean
  readonly isUnimplemented: boolean
  readonly isUntrustedReserveLocation: boolean
  readonly isUntrustedTeleportLocation: boolean
  readonly isMultiLocationFull: boolean
  readonly isMultiLocationNotInvertible: boolean
  readonly isBadOrigin: boolean
  readonly isInvalidLocation: boolean
  readonly isAssetNotFound: boolean
  readonly isFailedToTransactAsset: boolean
  readonly isNotWithdrawable: boolean
  readonly isLocationCannotHold: boolean
  readonly isExceedsMaxMessageSize: boolean
  readonly isDestinationUnsupported: boolean
  readonly isTransport: boolean
  readonly isUnroutable: boolean
  readonly isUnknownClaim: boolean
  readonly isFailedToDecode: boolean
  readonly isTooMuchWeightRequired: boolean
  readonly isNotHoldingFees: boolean
  readonly isTooExpensive: boolean
  readonly isTrap: boolean
  readonly asTrap: U64
  readonly isUnhandledXcmVersion: boolean
  readonly isWeightLimitReached: boolean
  readonly asWeightLimitReached: U64
  readonly isBarrier: boolean
  readonly isWeightNotComputable: boolean
}

export interface VersionedMultiLocation extends Enum {
  readonly isV0: boolean
  readonly asV0: MultiLocationV0
  readonly isV1: boolean
  readonly asV1: MultiLocationV1
}

export interface DispatchClass extends Enum {
  readonly isNormal: boolean
  readonly isOperational: boolean
  readonly isMandatory: boolean
}

export interface Pays extends Enum {
  readonly isYes: boolean
  readonly isNo: boolean
}

export interface DispatchErrorModule extends Struct {
  readonly index: U8
  readonly error: U8
}

export interface TokenError extends Enum {
  readonly isNoFunds: boolean
  readonly isWouldDie: boolean
  readonly isBelowMinimum: boolean
  readonly isCannotCreate: boolean
  readonly isUnknownAsset: boolean
  readonly isFrozen: boolean
  readonly isUnsupported: boolean
}

export interface ArithmeticError extends Enum {
  readonly isUnderflow: boolean
  readonly isOverflow: boolean
  readonly isDivisionByZero: boolean
}

export interface IndividualExposure extends Struct {
  readonly who: AccountId32
  readonly value: Compact<U128>
}

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

export interface Junctions extends Enum {
  readonly isHere: boolean
  readonly isX1: boolean
  readonly asX1: JunctionV1
  readonly isX2: boolean
  readonly asX2: ITuple<[JunctionV1, JunctionV1]>
  readonly isX3: boolean
  readonly asX3: ITuple<[JunctionV1, JunctionV1, JunctionV1]>
  readonly isX4: boolean
  readonly asX4: ITuple<[JunctionV1, JunctionV1, JunctionV1, JunctionV1]>
  readonly isX5: boolean
  readonly asX5: ITuple<[JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]>
  readonly isX6: boolean
  readonly asX6: ITuple<[JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]>
  readonly isX7: boolean
  readonly asX7: ITuple<[JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]>
  readonly isX8: boolean
  readonly asX8: ITuple<[JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1, JunctionV1]>
}

export interface InstructionV2 extends Enum {
  readonly isWithdrawAsset: boolean
  readonly asWithdrawAsset: MultiAssets
  readonly isReserveAssetDeposited: boolean
  readonly asReserveAssetDeposited: MultiAssets
  readonly isReceiveTeleportedAsset: boolean
  readonly asReceiveTeleportedAsset: MultiAssets
  readonly isQueryResponse: boolean
  readonly asQueryResponse: InstructionV2QueryResponse
  readonly isTransferAsset: boolean
  readonly asTransferAsset: InstructionV2TransferAsset
  readonly isTransferReserveAsset: boolean
  readonly asTransferReserveAsset: InstructionV2TransferReserveAsset
  readonly isTransact: boolean
  readonly asTransact: InstructionV2Transact
  readonly isHrmpNewChannelOpenRequest: boolean
  readonly asHrmpNewChannelOpenRequest: InstructionV2HrmpNewChannelOpenRequest
  readonly isHrmpChannelAccepted: boolean
  readonly asHrmpChannelAccepted: InstructionV2HrmpChannelAccepted
  readonly isHrmpChannelClosing: boolean
  readonly asHrmpChannelClosing: InstructionV2HrmpChannelClosing
  readonly isClearOrigin: boolean
  readonly isDescendOrigin: boolean
  readonly asDescendOrigin: Junctions
  readonly isReportError: boolean
  readonly asReportError: InstructionV2ReportError
  readonly isDepositAsset: boolean
  readonly asDepositAsset: InstructionV2DepositAsset
  readonly isDepositReserveAsset: boolean
  readonly asDepositReserveAsset: InstructionV2DepositReserveAsset
  readonly isExchangeAsset: boolean
  readonly asExchangeAsset: InstructionV2ExchangeAsset
  readonly isInitiateReserveWithdraw: boolean
  readonly asInitiateReserveWithdraw: InstructionV2InitiateReserveWithdraw
  readonly isInitiateTeleport: boolean
  readonly asInitiateTeleport: InstructionV2InitiateTeleport
  readonly isQueryHolding: boolean
  readonly asQueryHolding: InstructionV2QueryHolding
  readonly isBuyExecution: boolean
  readonly asBuyExecution: InstructionV2BuyExecution
  readonly isRefundSurplus: boolean
  readonly isSetErrorHandler: boolean
  readonly asSetErrorHandler: XcmV2
  readonly isSetAppendix: boolean
  readonly asSetAppendix: XcmV2
  readonly isClearError: boolean
  readonly isClaimAsset: boolean
  readonly asClaimAsset: InstructionV2ClaimAsset
  readonly isTrap: boolean
  readonly asTrap: Compact<U64>
  readonly isSubscribeVersion: boolean
  readonly asSubscribeVersion: InstructionV2SubscribeVersion
  readonly isUnsubscribeVersion: boolean
}

export interface MultiAssets extends Vec<MultiAssetV1> {}

export interface MultiAssetV0 extends Enum {
  readonly isNone: boolean
  readonly isAll: boolean
  readonly isAllFungible: boolean
  readonly isAllNonFungible: boolean
  readonly isAllAbstractFungible: boolean
  readonly asAllAbstractFungible: MultiAssetV0AllAbstractFungible
  readonly isAllAbstractNonFungible: boolean
  readonly asAllAbstractNonFungible: MultiAssetV0AllAbstractNonFungible
  readonly isAllConcreteFungible: boolean
  readonly asAllConcreteFungible: MultiAssetV0AllConcreteFungible
  readonly isAllConcreteNonFungible: boolean
  readonly asAllConcreteNonFungible: MultiAssetV0AllConcreteNonFungible
  readonly isAbstractFungible: boolean
  readonly asAbstractFungible: MultiAssetV0AbstractFungible
  readonly isAbstractNonFungible: boolean
  readonly asAbstractNonFungible: MultiAssetV0AbstractNonFungible
  readonly isConcreteFungible: boolean
  readonly asConcreteFungible: MultiAssetV0ConcreteFungible
  readonly isConcreteNonFungible: boolean
  readonly asConcreteNonFungible: MultiAssetV0ConcreteNonFungible
}

export interface MultiLocationV0 extends Enum {
  readonly isNull: boolean
  readonly isX1: boolean
  readonly asX1: JunctionV0
  readonly isX2: boolean
  readonly asX2: ITuple<[JunctionV0, JunctionV0]>
  readonly isX3: boolean
  readonly asX3: ITuple<[JunctionV0, JunctionV0, JunctionV0]>
  readonly isX4: boolean
  readonly asX4: ITuple<[JunctionV0, JunctionV0, JunctionV0, JunctionV0]>
  readonly isX5: boolean
  readonly asX5: ITuple<[JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]>
  readonly isX6: boolean
  readonly asX6: ITuple<[JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]>
  readonly isX7: boolean
  readonly asX7: ITuple<[JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]>
  readonly isX8: boolean
  readonly asX8: ITuple<[JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0, JunctionV0]>
}

export interface Signature extends U8aFixed {}

export interface ValidationCodeHash extends H256 {}

export interface JunctionV1 extends Enum {
  readonly isParachain: boolean
  readonly asParachain: Compact<U32>
  readonly isAccountId32: boolean
  readonly asAccountId32: JunctionV1AccountId32
  readonly isAccountIndex64: boolean
  readonly asAccountIndex64: JunctionV1AccountIndex64
  readonly isAccountKey20: boolean
  readonly asAccountKey20: JunctionV1AccountKey20
  readonly isPalletInstance: boolean
  readonly asPalletInstance: U8
  readonly isGeneralIndex: boolean
  readonly asGeneralIndex: Compact<U128>
  readonly isGeneralKey: boolean
  readonly asGeneralKey: Bytes
  readonly isOnlyChild: boolean
  readonly isPlurality: boolean
  readonly asPlurality: JunctionV1Plurality
}

export interface InstructionV2QueryResponse extends Struct {
  readonly queryId: Compact<U64>
  readonly response: ResponseV2
  readonly maxWeight: Compact<U64>
}

export interface InstructionV2TransferAsset extends Struct {
  readonly assets: MultiAssets
  readonly beneficiary: MultiLocationV1
}

export interface InstructionV2TransferReserveAsset extends Struct {
  readonly assets: MultiAssets
  readonly dest: MultiLocationV1
  readonly xcm: XcmV2
}

export interface InstructionV2Transact extends Struct {
  readonly originType: OriginKind
  readonly requireWeightAtMost: Compact<U64>
  readonly call: DoubleEncoded
}

export interface InstructionV2HrmpNewChannelOpenRequest extends Struct {
  readonly sender: Compact<U32>
  readonly maxMessageSize: Compact<U32>
  readonly maxCapacity: Compact<U32>
}

export interface InstructionV2HrmpChannelAccepted extends Struct {
  readonly recipient: Compact<U32>
}

export interface InstructionV2HrmpChannelClosing extends Struct {
  readonly initiator: Compact<U32>
  readonly sender: Compact<U32>
  readonly recipient: Compact<U32>
}

export interface InstructionV2ReportError extends Struct {
  readonly queryId: Compact<U64>
  readonly dest: MultiLocationV1
  readonly maxResponseWeight: Compact<U64>
}

export interface InstructionV2DepositAsset extends Struct {
  readonly assets: MultiAssetFilter
  readonly maxAssets: Compact<U32>
  readonly beneficiary: MultiLocationV1
}

export interface InstructionV2DepositReserveAsset extends Struct {
  readonly assets: MultiAssetFilter
  readonly maxAssets: Compact<U32>
  readonly dest: MultiLocationV1
  readonly xcm: XcmV2
}

export interface InstructionV2ExchangeAsset extends Struct {
  readonly give: MultiAssetFilter
  readonly receive: MultiAssets
}

export interface InstructionV2InitiateReserveWithdraw extends Struct {
  readonly assets: MultiAssetFilter
  readonly reserve: MultiLocationV1
  readonly xcm: XcmV2
}

export interface InstructionV2InitiateTeleport extends Struct {
  readonly assets: MultiAssetFilter
  readonly dest: MultiLocationV1
  readonly xcm: XcmV2
}

export interface InstructionV2QueryHolding extends Struct {
  readonly queryId: Compact<U64>
  readonly dest: MultiLocationV1
  readonly assets: MultiAssetFilter
  readonly maxResponseWeight: Compact<U64>
}

export interface InstructionV2BuyExecution extends Struct {
  readonly fees: MultiAssetV1
  readonly weightLimit: WeightLimit
}

export interface InstructionV2ClaimAsset extends Struct {
  readonly assets: MultiAssets
  readonly ticket: MultiLocationV1
}

export interface InstructionV2SubscribeVersion extends Struct {
  readonly queryId: Compact<U64>
  readonly maxResponseWeight: Compact<U64>
}

export interface MultiAssetV1 extends Struct {
  readonly id: AssetId
  readonly fun: Fungibility
}

export interface MultiAssetV0AllAbstractFungible extends Struct {
  readonly id: Bytes
}

export interface MultiAssetV0AllAbstractNonFungible extends Struct {
  readonly class: Bytes
}

export interface MultiAssetV0AllConcreteFungible extends Struct {
  readonly id: MultiLocationV0
}

export interface MultiAssetV0AllConcreteNonFungible extends Struct {
  readonly class: MultiLocationV0
}

export interface MultiAssetV0AbstractFungible extends Struct {
  readonly id: Bytes
  readonly amount: Compact<U128>
}

export interface MultiAssetV0AbstractNonFungible extends Struct {
  readonly class: Bytes
  readonly instance: AssetInstance
}

export interface MultiAssetV0ConcreteFungible extends Struct {
  readonly id: MultiLocationV0
  readonly amount: Compact<U128>
}

export interface MultiAssetV0ConcreteNonFungible extends Struct {
  readonly class: MultiLocationV0
  readonly instance: AssetInstance
}

export interface JunctionV0 extends Enum {
  readonly isParent: boolean
  readonly isParachain: boolean
  readonly asParachain: Compact<U32>
  readonly isAccountId32: boolean
  readonly asAccountId32: JunctionV0AccountId32
  readonly isAccountIndex64: boolean
  readonly asAccountIndex64: JunctionV0AccountIndex64
  readonly isAccountKey20: boolean
  readonly asAccountKey20: JunctionV0AccountKey20
  readonly isPalletInstance: boolean
  readonly asPalletInstance: U8
  readonly isGeneralIndex: boolean
  readonly asGeneralIndex: Compact<U128>
  readonly isGeneralKey: boolean
  readonly asGeneralKey: Bytes
  readonly isOnlyChild: boolean
  readonly isPlurality: boolean
  readonly asPlurality: JunctionV0Plurality
}

export interface JunctionV1AccountId32 extends Struct {
  readonly network: NetworkId
  readonly id: U8aFixed
}

export interface JunctionV1AccountIndex64 extends Struct {
  readonly network: NetworkId
  readonly index: Compact<U64>
}

export interface JunctionV1AccountKey20 extends Struct {
  readonly network: NetworkId
  readonly key: U8aFixed
}

export interface JunctionV1Plurality extends Struct {
  readonly id: BodyId
  readonly part: BodyPart
}

export interface OriginKind extends Enum {
  readonly isNative: boolean
  readonly isSovereignAccount: boolean
  readonly isSuperuser: boolean
  readonly isXcm: boolean
}

export interface DoubleEncoded extends Struct {
  readonly encoded: Bytes
}

export interface MultiAssetFilter extends Enum {
  readonly isDefinite: boolean
  readonly asDefinite: MultiAssets
  readonly isWild: boolean
  readonly asWild: WildMultiAsset
}

export interface WeightLimit extends Enum {
  readonly isUnlimited: boolean
  readonly isLimited: boolean
  readonly asLimited: Compact<U64>
}

export interface AssetId extends Enum {
  readonly isConcrete: boolean
  readonly asConcrete: MultiLocationV1
  readonly isAbstract: boolean
  readonly asAbstract: Bytes
}

export interface Fungibility extends Enum {
  readonly isFungible: boolean
  readonly asFungible: Compact<U128>
  readonly isNonFungible: boolean
  readonly asNonFungible: AssetInstance
}

export interface AssetInstance extends Enum {
  readonly isUndefined: boolean
  readonly isIndex: boolean
  readonly asIndex: Compact<U128>
  readonly isArray4: boolean
  readonly asArray4: U8aFixed
  readonly isArray8: boolean
  readonly asArray8: U8aFixed
  readonly isArray16: boolean
  readonly asArray16: U8aFixed
  readonly isArray32: boolean
  readonly asArray32: U8aFixed
  readonly isBlob: boolean
  readonly asBlob: Bytes
}

export interface JunctionV0AccountId32 extends Struct {
  readonly network: NetworkId
  readonly id: U8aFixed
}

export interface JunctionV0AccountIndex64 extends Struct {
  readonly network: NetworkId
  readonly index: Compact<U64>
}

export interface JunctionV0AccountKey20 extends Struct {
  readonly network: NetworkId
  readonly key: U8aFixed
}

export interface JunctionV0Plurality extends Struct {
  readonly id: BodyId
  readonly part: BodyPart
}

export interface NetworkId extends Enum {
  readonly isAny: boolean
  readonly isNamed: boolean
  readonly asNamed: Bytes
  readonly isPolkadot: boolean
  readonly isKusama: boolean
}

export interface BodyId extends Enum {
  readonly isUnit: boolean
  readonly isNamed: boolean
  readonly asNamed: Bytes
  readonly isIndex: boolean
  readonly asIndex: Compact<U32>
  readonly isExecutive: boolean
  readonly isTechnical: boolean
  readonly isLegislative: boolean
  readonly isJudicial: boolean
}

export interface BodyPart extends Enum {
  readonly isVoice: boolean
  readonly isMembers: boolean
  readonly asMembers: BodyPartMembers
  readonly isFraction: boolean
  readonly asFraction: BodyPartFraction
  readonly isAtLeastProportion: boolean
  readonly asAtLeastProportion: BodyPartAtLeastProportion
  readonly isMoreThanProportion: boolean
  readonly asMoreThanProportion: BodyPartMoreThanProportion
}

export interface WildMultiAsset extends Enum {
  readonly isAll: boolean
  readonly isAllOf: boolean
  readonly asAllOf: WildMultiAssetAllOf
}

export interface BodyPartMembers extends Struct {
  readonly count: Compact<U32>
}

export interface BodyPartFraction extends Struct {
  readonly nom: Compact<U32>
  readonly denom: Compact<U32>
}

export interface BodyPartAtLeastProportion extends Struct {
  readonly nom: Compact<U32>
  readonly denom: Compact<U32>
}

export interface BodyPartMoreThanProportion extends Struct {
  readonly nom: Compact<U32>
  readonly denom: Compact<U32>
}

export interface WildMultiAssetAllOf extends Struct {
  readonly id: AssetId
  readonly fun: WildFungibility
}

export interface WildFungibility extends Enum {
  readonly isFungible: boolean
  readonly isNonFungible: boolean
}
