/* tslint:disable */
import BigNumber from "bignumber.js";

export interface BasicTokenTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface BasicTokenTransferEvent extends EventMetadata {
    event: "Transfer";
    args: BasicTokenTransferPayload;
}

export interface CollectibleMockCollectCalledPayload {
    id: string;
    value: BigNumber;
}

export interface CollectibleMockCollectCalledEvent extends EventMetadata {
    event: "CollectCalled";
    args: CollectibleMockCollectCalledPayload;
}

export interface CollectibleMockCloseCalledPayload {
    id: string;
    value: BigNumber;
}

export interface CollectibleMockCloseCalledEvent extends EventMetadata {
    event: "CloseCalled";
    args: CollectibleMockCloseCalledPayload;
}

export interface DescriptiveERC20ApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface DescriptiveERC20ApprovalEvent extends EventMetadata {
    event: "Approval";
    args: DescriptiveERC20ApprovalPayload;
}

export interface DescriptiveERC20TransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface DescriptiveERC20TransferEvent extends EventMetadata {
    event: "Transfer";
    args: DescriptiveERC20TransferPayload;
}

export interface DestructibleOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface DestructibleOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: DestructibleOwnershipTransferredPayload;
}

export interface ERC20ApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface ERC20ApprovalEvent extends EventMetadata {
    event: "Approval";
    args: ERC20ApprovalPayload;
}

export interface ERC20TransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface ERC20TransferEvent extends EventMetadata {
    event: "Transfer";
    args: ERC20TransferPayload;
}

export interface ERC20BasicTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface ERC20BasicTransferEvent extends EventMetadata {
    event: "Transfer";
    args: ERC20BasicTransferPayload;
}

export interface EtherDeltaOrderPayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    expires: BigNumber;
    nonce: BigNumber;
    user: string;
}

export interface EtherDeltaOrderEvent extends EventMetadata {
    event: "Order";
    args: EtherDeltaOrderPayload;
}

export interface EtherDeltaCancelPayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    expires: BigNumber;
    nonce: BigNumber;
    user: string;
    v: BigNumber;
    r: string;
    s: string;
}

export interface EtherDeltaCancelEvent extends EventMetadata {
    event: "Cancel";
    args: EtherDeltaCancelPayload;
}

export interface EtherDeltaTradePayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    get: string;
    give: string;
}

export interface EtherDeltaTradeEvent extends EventMetadata {
    event: "Trade";
    args: EtherDeltaTradePayload;
}

export interface EtherDeltaDepositPayload {
    token: string;
    user: string;
    amount: BigNumber;
    balance: BigNumber;
}

export interface EtherDeltaDepositEvent extends EventMetadata {
    event: "Deposit";
    args: EtherDeltaDepositPayload;
}

export interface EtherDeltaWithdrawPayload {
    token: string;
    user: string;
    amount: BigNumber;
    balance: BigNumber;
}

export interface EtherDeltaWithdrawEvent extends EventMetadata {
    event: "Withdraw";
    args: EtherDeltaWithdrawPayload;
}

export interface EtherDeltaDebugPayload {
    key: BigNumber;
    value: string;
}

export interface EtherDeltaDebugEvent extends EventMetadata {
    event: "Debug";
    args: EtherDeltaDebugPayload;
}

export interface EtherDeltaDebugAccPayload {
    key: BigNumber;
    value: string;
}

export interface EtherDeltaDebugAccEvent extends EventMetadata {
    event: "DebugAcc";
    args: EtherDeltaDebugAccPayload;
}

export interface EtherDeltaExecutorOrderSuccessfulPayload {
    hash: string;
    beneficiary: string;
    tokenSold: string;
    amountSold: BigNumber;
    tokenBought: string;
    amountBought: BigNumber;
}

export interface EtherDeltaExecutorOrderSuccessfulEvent extends EventMetadata {
    event: "OrderSuccessful";
    args: EtherDeltaExecutorOrderSuccessfulPayload;
}

export interface EtherDeltaExecutorOrderFailedPayload {
    hash: string;
}

export interface EtherDeltaExecutorOrderFailedEvent extends EventMetadata {
    event: "OrderFailed";
    args: EtherDeltaExecutorOrderFailedPayload;
}

export interface EtherDeltaExecutorOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface EtherDeltaExecutorOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: EtherDeltaExecutorOwnershipTransferredPayload;
}

export interface IEtherDeltaOrderPayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    expires: BigNumber;
    nonce: BigNumber;
    user: string;
}

export interface IEtherDeltaOrderEvent extends EventMetadata {
    event: "Order";
    args: IEtherDeltaOrderPayload;
}

export interface IEtherDeltaCancelPayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    expires: BigNumber;
    nonce: BigNumber;
    user: string;
    v: BigNumber;
    r: string;
    s: string;
}

export interface IEtherDeltaCancelEvent extends EventMetadata {
    event: "Cancel";
    args: IEtherDeltaCancelPayload;
}

export interface IEtherDeltaTradePayload {
    tokenGet: string;
    amountGet: BigNumber;
    tokenGive: string;
    amountGive: BigNumber;
    get: string;
    give: string;
}

export interface IEtherDeltaTradeEvent extends EventMetadata {
    event: "Trade";
    args: IEtherDeltaTradePayload;
}

export interface IEtherDeltaDepositPayload {
    token: string;
    user: string;
    amount: BigNumber;
    balance: BigNumber;
}

export interface IEtherDeltaDepositEvent extends EventMetadata {
    event: "Deposit";
    args: IEtherDeltaDepositPayload;
}

export interface IEtherDeltaWithdrawPayload {
    token: string;
    user: string;
    amount: BigNumber;
    balance: BigNumber;
}

export interface IEtherDeltaWithdrawEvent extends EventMetadata {
    event: "Withdraw";
    args: IEtherDeltaWithdrawPayload;
}

export interface MigrationsOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface MigrationsOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: MigrationsOwnershipTransferredPayload;
}

export interface MockPortfolioOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface MockPortfolioOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: MockPortfolioOwnershipTransferredPayload;
}

export interface OwnableOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface OwnableOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: OwnableOwnershipTransferredPayload;
}

export interface SampleTokenApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface SampleTokenApprovalEvent extends EventMetadata {
    event: "Approval";
    args: SampleTokenApprovalPayload;
}

export interface SampleTokenTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface SampleTokenTransferEvent extends EventMetadata {
    event: "Transfer";
    args: SampleTokenTransferPayload;
}

export interface StandardTokenApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface StandardTokenApprovalEvent extends EventMetadata {
    event: "Approval";
    args: StandardTokenApprovalPayload;
}

export interface StandardTokenTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface StandardTokenTransferEvent extends EventMetadata {
    event: "Transfer";
    args: StandardTokenTransferPayload;
}

export interface TokenDestructibleOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface TokenDestructibleOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: TokenDestructibleOwnershipTransferredPayload;
}

export interface VeExposureExposureOpenedPayload {
    id: string;
    account: string;
    veriAmount: BigNumber;
    value: BigNumber;
    creationTime: BigNumber;
    closingTime: BigNumber;
}

export interface VeExposureExposureOpenedEvent extends EventMetadata {
    event: "ExposureOpened";
    args: VeExposureExposureOpenedPayload;
}

export interface VeExposureExposureCollectedPayload {
    id: string;
    account: string;
    value: BigNumber;
}

export interface VeExposureExposureCollectedEvent extends EventMetadata {
    event: "ExposureCollected";
    args: VeExposureExposureCollectedPayload;
}

export interface VeExposureExposureClosedPayload {
    id: string;
    account: string;
    initialValue: BigNumber;
    finalValue: BigNumber;
}

export interface VeExposureExposureClosedEvent extends EventMetadata {
    event: "ExposureClosed";
    args: VeExposureExposureClosedPayload;
}

export interface VeExposureExposureSettledPayload {
    id: string;
    account: string;
    value: BigNumber;
}

export interface VeExposureExposureSettledEvent extends EventMetadata {
    event: "ExposureSettled";
    args: VeExposureExposureSettledPayload;
}

export interface VeExposureOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeExposureOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeExposureOwnershipTransferredPayload;
}

export interface VePortfolioBucketCreatedPayload {
    id: string;
    initialValue: BigNumber;
}

export interface VePortfolioBucketCreatedEvent extends EventMetadata {
    event: "BucketCreated";
    args: VePortfolioBucketCreatedPayload;
}

export interface VePortfolioBucketBuyPayload {
    id: string;
    etherSpent: BigNumber;
    token: string;
    tokensBought: BigNumber;
}

export interface VePortfolioBucketBuyEvent extends EventMetadata {
    event: "BucketBuy";
    args: VePortfolioBucketBuyPayload;
}

export interface VePortfolioBucketSellPayload {
    id: string;
    etherBought: BigNumber;
    token: string;
    tokensSold: BigNumber;
}

export interface VePortfolioBucketSellEvent extends EventMetadata {
    event: "BucketSell";
    args: VePortfolioBucketSellPayload;
}

export interface VePortfolioBucketDestroyedPayload {
    id: string;
    finalValue: BigNumber;
}

export interface VePortfolioBucketDestroyedEvent extends EventMetadata {
    event: "BucketDestroyed";
    args: VePortfolioBucketDestroyedPayload;
}

export interface VePortfolioTradingOpenPayload {
    id: string;
}

export interface VePortfolioTradingOpenEvent extends EventMetadata {
    event: "TradingOpen";
    args: VePortfolioTradingOpenPayload;
}

export interface VePortfolioTradingClosePayload {
    id: string;
}

export interface VePortfolioTradingCloseEvent extends EventMetadata {
    event: "TradingClose";
    args: VePortfolioTradingClosePayload;
}

export interface VePortfolioOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VePortfolioOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VePortfolioOwnershipTransferredPayload;
}

export interface VeRegistryAssetCreatedPayload {
    addr: string;
}

export interface VeRegistryAssetCreatedEvent extends EventMetadata {
    event: "AssetCreated";
    args: VeRegistryAssetCreatedPayload;
}

export interface VeRegistryAssetRegisteredPayload {
    addr: string;
    symbol: string;
    name: string;
    description: string;
    decimals: BigNumber;
}

export interface VeRegistryAssetRegisteredEvent extends EventMetadata {
    event: "AssetRegistered";
    args: VeRegistryAssetRegisteredPayload;
}

export interface VeRegistryMetaUpdatedPayload {
    symbol: string;
    meta: string;
}

export interface VeRegistryMetaUpdatedEvent extends EventMetadata {
    event: "MetaUpdated";
    args: VeRegistryMetaUpdatedPayload;
}

export interface VeRegistryOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeRegistryOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeRegistryOwnershipTransferredPayload;
}

export interface VeRentVeriOfferAddedPayload {
    id: string;
    account: string;
    veriAmount: BigNumber;
    price: BigNumber;
    duration: BigNumber;
    expiration: BigNumber;
}

export interface VeRentVeriOfferAddedEvent extends EventMetadata {
    event: "VeriOfferAdded";
    args: VeRentVeriOfferAddedPayload;
}

export interface VeRentEtherOfferAddedPayload {
    id: string;
    account: string;
    veriAmount: BigNumber;
    value: BigNumber;
    price: BigNumber;
    duration: BigNumber;
    expiration: BigNumber;
}

export interface VeRentEtherOfferAddedEvent extends EventMetadata {
    event: "EtherOfferAdded";
    args: VeRentEtherOfferAddedPayload;
}

export interface VeRentDealMadePayload {
    id: string;
    veriId: string;
    etherId: string;
    veriAccount: string;
    etherAccount: string;
    veriAmount: BigNumber;
    value: BigNumber;
    price: BigNumber;
    duration: BigNumber;
}

export interface VeRentDealMadeEvent extends EventMetadata {
    event: "DealMade";
    args: VeRentDealMadePayload;
}

export interface VeRentVeriOfferCancelledPayload {
    id: string;
}

export interface VeRentVeriOfferCancelledEvent extends EventMetadata {
    event: "VeriOfferCancelled";
    args: VeRentVeriOfferCancelledPayload;
}

export interface VeRentEtherOfferCancelledPayload {
    id: string;
}

export interface VeRentEtherOfferCancelledEvent extends EventMetadata {
    event: "EtherOfferCancelled";
    args: VeRentEtherOfferCancelledPayload;
}

export interface VeRentOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeRentOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeRentOwnershipTransferredPayload;
}

export interface VeRentExposureRentExposureOpenedPayload {
    id: string;
    veriAccount: string;
    etherAccount: string;
    veriAmount: BigNumber;
    value: BigNumber;
    price: BigNumber;
    duration: BigNumber;
}

export interface VeRentExposureRentExposureOpenedEvent extends EventMetadata {
    event: "RentExposureOpened";
    args: VeRentExposureRentExposureOpenedPayload;
}

export interface VeRentExposureVeriExposureSettledPayload {
    id: string;
    account: string;
    value: BigNumber;
}

export interface VeRentExposureVeriExposureSettledEvent extends EventMetadata {
    event: "VeriExposureSettled";
    args: VeRentExposureVeriExposureSettledPayload;
}

export interface VeRentExposureEtherExposureSettledPayload {
    id: string;
    account: string;
    value: BigNumber;
}

export interface VeRentExposureEtherExposureSettledEvent extends EventMetadata {
    event: "EtherExposureSettled";
    args: VeRentExposureEtherExposureSettledPayload;
}

export interface VeRentExposureOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeRentExposureOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeRentExposureOwnershipTransferredPayload;
}

export interface VeTokenRegistryAssetCreatedPayload {
    addr: string;
}

export interface VeTokenRegistryAssetCreatedEvent extends EventMetadata {
    event: "AssetCreated";
    args: VeTokenRegistryAssetCreatedPayload;
}

export interface VeTokenRegistryAssetRegisteredPayload {
    addr: string;
    symbol: string;
    name: string;
    description: string;
    decimals: BigNumber;
}

export interface VeTokenRegistryAssetRegisteredEvent extends EventMetadata {
    event: "AssetRegistered";
    args: VeTokenRegistryAssetRegisteredPayload;
}

export interface VeTokenRegistryMetaUpdatedPayload {
    symbol: string;
    meta: string;
}

export interface VeTokenRegistryMetaUpdatedEvent extends EventMetadata {
    event: "MetaUpdated";
    args: VeTokenRegistryMetaUpdatedPayload;
}

export interface VeTokenRegistryOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeTokenRegistryOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeTokenRegistryOwnershipTransferredPayload;
}

export interface VeTokenizedAssetSourceChangedPayload {
    newSource: string;
    newProof: string;
    newTotalSupply: BigNumber;
}

export interface VeTokenizedAssetSourceChangedEvent extends EventMetadata {
    event: "SourceChanged";
    args: VeTokenizedAssetSourceChangedPayload;
}

export interface VeTokenizedAssetSupplyChangedPayload {
    newTotalSupply: BigNumber;
}

export interface VeTokenizedAssetSupplyChangedEvent extends EventMetadata {
    event: "SupplyChanged";
    args: VeTokenizedAssetSupplyChangedPayload;
}

export interface VeTokenizedAssetOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeTokenizedAssetOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeTokenizedAssetOwnershipTransferredPayload;
}

export interface VeTokenizedAssetApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface VeTokenizedAssetApprovalEvent extends EventMetadata {
    event: "Approval";
    args: VeTokenizedAssetApprovalPayload;
}

export interface VeTokenizedAssetTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface VeTokenizedAssetTransferEvent extends EventMetadata {
    event: "Transfer";
    args: VeTokenizedAssetTransferPayload;
}

export interface VeTokenizedAssetRegistryAssetCreatedPayload {
    addr: string;
}

export interface VeTokenizedAssetRegistryAssetCreatedEvent extends EventMetadata {
    event: "AssetCreated";
    args: VeTokenizedAssetRegistryAssetCreatedPayload;
}

export interface VeTokenizedAssetRegistryAssetRegisteredPayload {
    addr: string;
    symbol: string;
    name: string;
    description: string;
    decimals: BigNumber;
}

export interface VeTokenizedAssetRegistryAssetRegisteredEvent extends EventMetadata {
    event: "AssetRegistered";
    args: VeTokenizedAssetRegistryAssetRegisteredPayload;
}

export interface VeTokenizedAssetRegistryMetaUpdatedPayload {
    symbol: string;
    meta: string;
}

export interface VeTokenizedAssetRegistryMetaUpdatedEvent extends EventMetadata {
    event: "MetaUpdated";
    args: VeTokenizedAssetRegistryMetaUpdatedPayload;
}

export interface VeTokenizedAssetRegistryOwnershipTransferredPayload {
    previousOwner: string;
    newOwner: string;
}

export interface VeTokenizedAssetRegistryOwnershipTransferredEvent extends EventMetadata {
    event: "OwnershipTransferred";
    args: VeTokenizedAssetRegistryOwnershipTransferredPayload;
}

export interface VeritaseumTokenTransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface VeritaseumTokenTransferEvent extends EventMetadata {
    event: "Transfer";
    args: VeritaseumTokenTransferPayload;
}

export interface VeritaseumTokenApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface VeritaseumTokenApprovalEvent extends EventMetadata {
    event: "Approval";
    args: VeritaseumTokenApprovalPayload;
}

export interface EventMetadata {
    type: string;
    address: string;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
}

export type BasicTokenEvents = BasicTokenTransferEvent;
export type CollectibleEvents = never;
export type CollectibleMockEvents = CollectibleMockCollectCalledEvent | CollectibleMockCloseCalledEvent;
export type DescriptiveERC20Events = DescriptiveERC20ApprovalEvent | DescriptiveERC20TransferEvent;
export type DestructibleEvents = DestructibleOwnershipTransferredEvent;
export type EDExecutorEvents = never;
export type ERC20Events = ERC20ApprovalEvent | ERC20TransferEvent;
export type ERC20BasicEvents = ERC20BasicTransferEvent;
export type EtherDeltaEvents = EtherDeltaOrderEvent | EtherDeltaCancelEvent | EtherDeltaTradeEvent | EtherDeltaDepositEvent | EtherDeltaWithdrawEvent | EtherDeltaDebugEvent | EtherDeltaDebugAccEvent;
export type EtherDeltaExecutorEvents = EtherDeltaExecutorOrderSuccessfulEvent | EtherDeltaExecutorOrderFailedEvent | EtherDeltaExecutorOwnershipTransferredEvent;
export type IEtherDeltaEvents = IEtherDeltaOrderEvent | IEtherDeltaCancelEvent | IEtherDeltaTradeEvent | IEtherDeltaDepositEvent | IEtherDeltaWithdrawEvent;
export type MigrationsEvents = MigrationsOwnershipTransferredEvent;
export type MockEtherDeltaExecutorEvents = never;
export type MockPortfolioEvents = MockPortfolioOwnershipTransferredEvent;
export type OwnableEvents = OwnableOwnershipTransferredEvent;
export type SafeMathEvents = never;
export type SampleTokenEvents = SampleTokenApprovalEvent | SampleTokenTransferEvent;
export type StandardTokenEvents = StandardTokenApprovalEvent | StandardTokenTransferEvent;
export type TokenDestructibleEvents = TokenDestructibleOwnershipTransferredEvent;
export type VeADIREvents = never;
export type VeExposureEvents = VeExposureExposureOpenedEvent | VeExposureExposureCollectedEvent | VeExposureExposureClosedEvent | VeExposureExposureSettledEvent | VeExposureOwnershipTransferredEvent;
export type VePortfolioEvents = VePortfolioBucketCreatedEvent | VePortfolioBucketBuyEvent | VePortfolioBucketSellEvent | VePortfolioBucketDestroyedEvent | VePortfolioTradingOpenEvent | VePortfolioTradingCloseEvent | VePortfolioOwnershipTransferredEvent;
export type VeRegistryEvents = VeRegistryAssetCreatedEvent | VeRegistryAssetRegisteredEvent | VeRegistryMetaUpdatedEvent | VeRegistryOwnershipTransferredEvent;
export type VeRentEvents = VeRentVeriOfferAddedEvent | VeRentEtherOfferAddedEvent | VeRentDealMadeEvent | VeRentVeriOfferCancelledEvent | VeRentEtherOfferCancelledEvent | VeRentOwnershipTransferredEvent;
export type VeRentExposureEvents = VeRentExposureRentExposureOpenedEvent | VeRentExposureVeriExposureSettledEvent | VeRentExposureEtherExposureSettledEvent | VeRentExposureOwnershipTransferredEvent;
export type VeTokenRegistryEvents = VeTokenRegistryAssetCreatedEvent | VeTokenRegistryAssetRegisteredEvent | VeTokenRegistryMetaUpdatedEvent | VeTokenRegistryOwnershipTransferredEvent;
export type VeTokenizedAssetEvents = VeTokenizedAssetSourceChangedEvent | VeTokenizedAssetSupplyChangedEvent | VeTokenizedAssetOwnershipTransferredEvent | VeTokenizedAssetApprovalEvent | VeTokenizedAssetTransferEvent;
export type VeTokenizedAssetRegistryEvents = VeTokenizedAssetRegistryAssetCreatedEvent | VeTokenizedAssetRegistryAssetRegisteredEvent | VeTokenizedAssetRegistryMetaUpdatedEvent | VeTokenizedAssetRegistryOwnershipTransferredEvent;
export type VeritaseumTokenEvents = VeritaseumTokenTransferEvent | VeritaseumTokenApprovalEvent;
export type ContractsEvents = BasicTokenEvents | CollectibleEvents | CollectibleMockEvents | DescriptiveERC20Events | DestructibleEvents | EDExecutorEvents | ERC20Events | ERC20BasicEvents | EtherDeltaEvents | EtherDeltaExecutorEvents | IEtherDeltaEvents | MigrationsEvents | MockEtherDeltaExecutorEvents | MockPortfolioEvents | OwnableEvents | SafeMathEvents | SampleTokenEvents | StandardTokenEvents | TokenDestructibleEvents | VeADIREvents | VeExposureEvents | VePortfolioEvents | VeRegistryEvents | VeRentEvents | VeRentExposureEvents | VeTokenRegistryEvents | VeTokenizedAssetEvents | VeTokenizedAssetRegistryEvents | VeritaseumTokenEvents;
