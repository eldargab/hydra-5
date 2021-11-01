import type {Bool, Bytes, Compact, Enum, Null, Struct, U128, U16, U32, U64, U8, U8aFixed, Vec} from '@polkadot/types'
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

export interface Public_38 extends Public_39 {}

export interface Public_41 extends Public {}

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

export interface Result_52 extends Enum {
  readonly isOk: boolean
  readonly asOk: Null
  readonly isErr: boolean
  readonly asErr: DispatchError
}

export interface EthereumAddress extends U8aFixed {}

export interface Option_72 extends Enum {
  readonly isNone: boolean
  readonly isSome: boolean
  readonly asSome: Bytes
}

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

export interface Option_82 extends Enum {
  readonly isNone: boolean
  readonly isSome: boolean
  readonly asSome: ElectionCompute
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
  readonly asIncomplete: ITuple<[U64, Error]>
  readonly isError: boolean
  readonly asError: Error
}

export interface HrmpChannelId extends Struct {
  readonly sender: Id
  readonly recipient: Id
}

export interface MultiLocation extends Struct {
  readonly parents: U8
  readonly interior: Junctions
}

export interface Xcm_116 extends Vec<Instruction> {}

export interface Response extends Enum {
  readonly isNull: boolean
  readonly isAssets: boolean
  readonly asAssets: MultiAssets
  readonly isExecutionResult: boolean
  readonly asExecutionResult: Option_127
  readonly isVersion: boolean
  readonly asVersion: U32
}

export interface Option_135 extends Enum {
  readonly isNone: boolean
  readonly isSome: boolean
  readonly asSome: MultiLocation
}

export interface VersionedMultiAssets extends Enum {
  readonly isV0: boolean
  readonly asV0: Vec<MultiAsset_138>
  readonly isV1: boolean
  readonly asV1: MultiAssets
}

export interface Error extends Enum {
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
  readonly asV0: MultiLocation_139
  readonly isV1: boolean
  readonly asV1: MultiLocation
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

export interface Public_39 extends U8aFixed {}

export interface Public extends U8aFixed {}

export interface IndividualExposure extends Struct {
  readonly who: AccountId32
  readonly value: Compact<U128>
}

export interface CandidateDescriptor extends Struct {
  readonly paraId: Id
  readonly relayParent: H256
  readonly collator: Public_89
  readonly persistedValidationDataHash: H256
  readonly povHash: H256
  readonly erasureRoot: H256
  readonly signature: Signature_90
  readonly paraHead: H256
  readonly validationCodeHash: ValidationCodeHash
}

export interface Junctions extends Enum {
  readonly isHere: boolean
  readonly isX1: boolean
  readonly asX1: Junction
  readonly isX2: boolean
  readonly asX2: ITuple<[Junction, Junction]>
  readonly isX3: boolean
  readonly asX3: ITuple<[Junction, Junction, Junction]>
  readonly isX4: boolean
  readonly asX4: ITuple<[Junction, Junction, Junction, Junction]>
  readonly isX5: boolean
  readonly asX5: ITuple<[Junction, Junction, Junction, Junction, Junction]>
  readonly isX6: boolean
  readonly asX6: ITuple<[Junction, Junction, Junction, Junction, Junction, Junction]>
  readonly isX7: boolean
  readonly asX7: ITuple<[Junction, Junction, Junction, Junction, Junction, Junction, Junction]>
  readonly isX8: boolean
  readonly asX8: ITuple<[Junction, Junction, Junction, Junction, Junction, Junction, Junction, Junction]>
}

export interface Instruction extends Enum {
  readonly isWithdrawAsset: boolean
  readonly asWithdrawAsset: MultiAssets
  readonly isReserveAssetDeposited: boolean
  readonly asReserveAssetDeposited: MultiAssets
  readonly isReceiveTeleportedAsset: boolean
  readonly asReceiveTeleportedAsset: MultiAssets
  readonly isQueryResponse: boolean
  readonly asQueryResponse: InstructionQueryResponse
  readonly isTransferAsset: boolean
  readonly asTransferAsset: InstructionTransferAsset
  readonly isTransferReserveAsset: boolean
  readonly asTransferReserveAsset: InstructionTransferReserveAsset
  readonly isTransact: boolean
  readonly asTransact: InstructionTransact
  readonly isHrmpNewChannelOpenRequest: boolean
  readonly asHrmpNewChannelOpenRequest: InstructionHrmpNewChannelOpenRequest
  readonly isHrmpChannelAccepted: boolean
  readonly asHrmpChannelAccepted: InstructionHrmpChannelAccepted
  readonly isHrmpChannelClosing: boolean
  readonly asHrmpChannelClosing: InstructionHrmpChannelClosing
  readonly isClearOrigin: boolean
  readonly isDescendOrigin: boolean
  readonly asDescendOrigin: Junctions
  readonly isReportError: boolean
  readonly asReportError: InstructionReportError
  readonly isDepositAsset: boolean
  readonly asDepositAsset: InstructionDepositAsset
  readonly isDepositReserveAsset: boolean
  readonly asDepositReserveAsset: InstructionDepositReserveAsset
  readonly isExchangeAsset: boolean
  readonly asExchangeAsset: InstructionExchangeAsset
  readonly isInitiateReserveWithdraw: boolean
  readonly asInitiateReserveWithdraw: InstructionInitiateReserveWithdraw
  readonly isInitiateTeleport: boolean
  readonly asInitiateTeleport: InstructionInitiateTeleport
  readonly isQueryHolding: boolean
  readonly asQueryHolding: InstructionQueryHolding
  readonly isBuyExecution: boolean
  readonly asBuyExecution: InstructionBuyExecution
  readonly isRefundSurplus: boolean
  readonly isSetErrorHandler: boolean
  readonly asSetErrorHandler: Xcm_116
  readonly isSetAppendix: boolean
  readonly asSetAppendix: Xcm_116
  readonly isClearError: boolean
  readonly isClaimAsset: boolean
  readonly asClaimAsset: InstructionClaimAsset
  readonly isTrap: boolean
  readonly asTrap: Compact<U64>
  readonly isSubscribeVersion: boolean
  readonly asSubscribeVersion: InstructionSubscribeVersion
  readonly isUnsubscribeVersion: boolean
}

export interface MultiAssets extends Vec<MultiAsset> {}

export interface Option_127 extends Enum {
  readonly isNone: boolean
  readonly isSome: boolean
  readonly asSome: ITuple<[U32, Error]>
}

export interface MultiAsset_138 extends Enum {
  readonly isNone: boolean
  readonly isAll: boolean
  readonly isAllFungible: boolean
  readonly isAllNonFungible: boolean
  readonly isAllAbstractFungible: boolean
  readonly asAllAbstractFungible: MultiAsset_138AllAbstractFungible
  readonly isAllAbstractNonFungible: boolean
  readonly asAllAbstractNonFungible: MultiAsset_138AllAbstractNonFungible
  readonly isAllConcreteFungible: boolean
  readonly asAllConcreteFungible: MultiAsset_138AllConcreteFungible
  readonly isAllConcreteNonFungible: boolean
  readonly asAllConcreteNonFungible: MultiAsset_138AllConcreteNonFungible
  readonly isAbstractFungible: boolean
  readonly asAbstractFungible: MultiAsset_138AbstractFungible
  readonly isAbstractNonFungible: boolean
  readonly asAbstractNonFungible: MultiAsset_138AbstractNonFungible
  readonly isConcreteFungible: boolean
  readonly asConcreteFungible: MultiAsset_138ConcreteFungible
  readonly isConcreteNonFungible: boolean
  readonly asConcreteNonFungible: MultiAsset_138ConcreteNonFungible
}

export interface MultiLocation_139 extends Enum {
  readonly isNull: boolean
  readonly isX1: boolean
  readonly asX1: Junction_140
  readonly isX2: boolean
  readonly asX2: ITuple<[Junction_140, Junction_140]>
  readonly isX3: boolean
  readonly asX3: ITuple<[Junction_140, Junction_140, Junction_140]>
  readonly isX4: boolean
  readonly asX4: ITuple<[Junction_140, Junction_140, Junction_140, Junction_140]>
  readonly isX5: boolean
  readonly asX5: ITuple<[Junction_140, Junction_140, Junction_140, Junction_140, Junction_140]>
  readonly isX6: boolean
  readonly asX6: ITuple<[Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140]>
  readonly isX7: boolean
  readonly asX7: ITuple<[Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140]>
  readonly isX8: boolean
  readonly asX8: ITuple<[Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140, Junction_140]>
}

export interface Public_89 extends Public {}

export interface Signature_90 extends Signature {}

export interface ValidationCodeHash extends H256 {}

export interface Junction extends Enum {
  readonly isParachain: boolean
  readonly asParachain: Compact<U32>
  readonly isAccountId32: boolean
  readonly asAccountId32: JunctionAccountId32
  readonly isAccountIndex64: boolean
  readonly asAccountIndex64: JunctionAccountIndex64
  readonly isAccountKey20: boolean
  readonly asAccountKey20: JunctionAccountKey20
  readonly isPalletInstance: boolean
  readonly asPalletInstance: U8
  readonly isGeneralIndex: boolean
  readonly asGeneralIndex: Compact<U128>
  readonly isGeneralKey: boolean
  readonly asGeneralKey: Bytes
  readonly isOnlyChild: boolean
  readonly isPlurality: boolean
  readonly asPlurality: JunctionPlurality
}

export interface InstructionQueryResponse extends Struct {
  readonly queryId: Compact<U64>
  readonly response: Response
  readonly maxWeight: Compact<U64>
}

export interface InstructionTransferAsset extends Struct {
  readonly assets: MultiAssets
  readonly beneficiary: MultiLocation
}

export interface InstructionTransferReserveAsset extends Struct {
  readonly assets: MultiAssets
  readonly dest: MultiLocation
  readonly xcm: Xcm_116
}

export interface InstructionTransact extends Struct {
  readonly originType: OriginKind
  readonly requireWeightAtMost: Compact<U64>
  readonly call: DoubleEncoded
}

export interface InstructionHrmpNewChannelOpenRequest extends Struct {
  readonly sender: Compact<U32>
  readonly maxMessageSize: Compact<U32>
  readonly maxCapacity: Compact<U32>
}

export interface InstructionHrmpChannelAccepted extends Struct {
  readonly recipient: Compact<U32>
}

export interface InstructionHrmpChannelClosing extends Struct {
  readonly initiator: Compact<U32>
  readonly sender: Compact<U32>
  readonly recipient: Compact<U32>
}

export interface InstructionReportError extends Struct {
  readonly queryId: Compact<U64>
  readonly dest: MultiLocation
  readonly maxResponseWeight: Compact<U64>
}

export interface InstructionDepositAsset extends Struct {
  readonly assets: MultiAssetFilter
  readonly maxAssets: Compact<U32>
  readonly beneficiary: MultiLocation
}

export interface InstructionDepositReserveAsset extends Struct {
  readonly assets: MultiAssetFilter
  readonly maxAssets: Compact<U32>
  readonly dest: MultiLocation
  readonly xcm: Xcm_116
}

export interface InstructionExchangeAsset extends Struct {
  readonly give: MultiAssetFilter
  readonly receive: MultiAssets
}

export interface InstructionInitiateReserveWithdraw extends Struct {
  readonly assets: MultiAssetFilter
  readonly reserve: MultiLocation
  readonly xcm: Xcm_116
}

export interface InstructionInitiateTeleport extends Struct {
  readonly assets: MultiAssetFilter
  readonly dest: MultiLocation
  readonly xcm: Xcm_116
}

export interface InstructionQueryHolding extends Struct {
  readonly queryId: Compact<U64>
  readonly dest: MultiLocation
  readonly assets: MultiAssetFilter
  readonly maxResponseWeight: Compact<U64>
}

export interface InstructionBuyExecution extends Struct {
  readonly fees: MultiAsset
  readonly weightLimit: WeightLimit
}

export interface InstructionClaimAsset extends Struct {
  readonly assets: MultiAssets
  readonly ticket: MultiLocation
}

export interface InstructionSubscribeVersion extends Struct {
  readonly queryId: Compact<U64>
  readonly maxResponseWeight: Compact<U64>
}

export interface MultiAsset extends Struct {
  readonly id: AssetId
  readonly fun: Fungibility
}

export interface MultiAsset_138AllAbstractFungible extends Struct {
  readonly id: Bytes
}

export interface MultiAsset_138AllAbstractNonFungible extends Struct {
  readonly class: Bytes
}

export interface MultiAsset_138AllConcreteFungible extends Struct {
  readonly id: MultiLocation_139
}

export interface MultiAsset_138AllConcreteNonFungible extends Struct {
  readonly class: MultiLocation_139
}

export interface MultiAsset_138AbstractFungible extends Struct {
  readonly id: Bytes
  readonly amount: Compact<U128>
}

export interface MultiAsset_138AbstractNonFungible extends Struct {
  readonly class: Bytes
  readonly instance: AssetInstance
}

export interface MultiAsset_138ConcreteFungible extends Struct {
  readonly id: MultiLocation_139
  readonly amount: Compact<U128>
}

export interface MultiAsset_138ConcreteNonFungible extends Struct {
  readonly class: MultiLocation_139
  readonly instance: AssetInstance
}

export interface Junction_140 extends Enum {
  readonly isParent: boolean
  readonly isParachain: boolean
  readonly asParachain: Compact<U32>
  readonly isAccountId32: boolean
  readonly asAccountId32: Junction_140AccountId32
  readonly isAccountIndex64: boolean
  readonly asAccountIndex64: Junction_140AccountIndex64
  readonly isAccountKey20: boolean
  readonly asAccountKey20: Junction_140AccountKey20
  readonly isPalletInstance: boolean
  readonly asPalletInstance: U8
  readonly isGeneralIndex: boolean
  readonly asGeneralIndex: Compact<U128>
  readonly isGeneralKey: boolean
  readonly asGeneralKey: Bytes
  readonly isOnlyChild: boolean
  readonly isPlurality: boolean
  readonly asPlurality: Junction_140Plurality
}

export interface Signature extends U8aFixed {}

export interface JunctionAccountId32 extends Struct {
  readonly network: NetworkId
  readonly id: U8aFixed
}

export interface JunctionAccountIndex64 extends Struct {
  readonly network: NetworkId
  readonly index: Compact<U64>
}

export interface JunctionAccountKey20 extends Struct {
  readonly network: NetworkId
  readonly key: U8aFixed
}

export interface JunctionPlurality extends Struct {
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
  readonly asConcrete: MultiLocation
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

export interface Junction_140AccountId32 extends Struct {
  readonly network: NetworkId
  readonly id: U8aFixed
}

export interface Junction_140AccountIndex64 extends Struct {
  readonly network: NetworkId
  readonly index: Compact<U64>
}

export interface Junction_140AccountKey20 extends Struct {
  readonly network: NetworkId
  readonly key: U8aFixed
}

export interface Junction_140Plurality extends Struct {
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
