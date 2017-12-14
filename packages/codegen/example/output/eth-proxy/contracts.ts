/* tslint:disable */
import BigNumber from "bignumber.js";
import {TransactionResult, CallResult, EventMetadata} from "@eth-proxy/client";

export interface Contracts {
    ERC20: ERC20;
}

export interface ERC20 {
    approve(input: ERC20ApproveInput, options?: TransactionOptions): TransactionResult<ContractsEvents>;
    totalSupply(options?: TransactionOptions): CallResult<BigNumber>;
    transferFrom(input: ERC20TransferFromInput, options?: TransactionOptions): TransactionResult<ContractsEvents>;
    balanceOf(who: string, options?: TransactionOptions): CallResult<BigNumber>;
    transfer(input: ERC20TransferInput, options?: TransactionOptions): TransactionResult<ContractsEvents>;
    allowance(input: ERC20AllowanceInput, options?: TransactionOptions): CallResult<BigNumber>;
}

export interface ERC20ApproveInput {
    spender: string;
    value: BigNumber | number | string;
}

export interface ERC20TransferFromInput {
    from: string;
    to: string;
    value: BigNumber | number | string;
}

export interface ERC20TransferInput {
    to: string;
    value: BigNumber | number | string;
}

export interface ERC20AllowanceInput {
    owner: string;
    spender: string;
}

export interface TransactionOptions {
    from?: string;
    value?: number | BigNumber;
    gas?: number | BigNumber;
    gasPrice?: number | BigNumber;
}

export interface ERC20TransferPayload {
    from: string;
    to: string;
    value: BigNumber;
}

export interface ERC20TransferEvent {
    type: "Transfer";
    payload: ERC20TransferPayload;
    meta: EventMetadata;
}

export interface ERC20ApprovalPayload {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface ERC20ApprovalEvent {
    type: "Approval";
    payload: ERC20ApprovalPayload;
    meta: EventMetadata;
}

export type ContractsEvents = ERC20Events;
export type ERC20Events = ERC20TransferEvent | ERC20ApprovalEvent;
