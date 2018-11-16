/* tslint:disable */
import { BigNumber } from 'bignumber.js';
import { EventMetadata } from '@eth-proxy/rpc';

export type SampleTokenEvents =
  | SampleTokenApprovalEvent
  | SampleTokenTransferEvent;
export type ContractsEvents = SampleTokenEvents;
export type NumberLike = BigNumber | string | number;

export interface EventsByType {
  SampleToken: SampleTokenEventsByType;
}

export interface SampleTokenEventsByType {
  Approval: SampleTokenApprovalEvent;
  Transfer: SampleTokenTransferEvent;
}

export interface TransactionOptions {
  from?: string;
  value?: NumberLike;
  gas?: NumberLike;
  gasPrice?: NumberLike;
  nonce?: NumberLike;
}

export interface Contracts {
  SampleToken: SampleToken;
}

export interface SampleToken {
  name: SampleTokenNameDefinition;
  approve: SampleTokenApproveDefinition;
  totalSupply: SampleTokenTotalSupplyDefinition;
  transferFrom: SampleTokenTransferFromDefinition;
  decimals: SampleTokenDecimalsDefinition;
  decreaseApproval: SampleTokenDecreaseApprovalDefinition;
  balanceOf: SampleTokenBalanceOfDefinition;
  symbol: SampleTokenSymbolDefinition;
  transfer: SampleTokenTransferDefinition;
  increaseApproval: SampleTokenIncreaseApprovalDefinition;
  allowance: SampleTokenAllowanceDefinition;
}

export interface SampleTokenNameDefinition {
  out: string;
  events: ContractsEvents;
}

export interface SampleTokenApproveDefinition {
  in: SampleTokenApproveInput;
  out: boolean;
  events: ContractsEvents;
}

export interface SampleTokenTotalSupplyDefinition {
  out: BigNumber;
  events: ContractsEvents;
}

export interface SampleTokenTransferFromDefinition {
  in: SampleTokenTransferFromInput;
  out: boolean;
  events: ContractsEvents;
}

export interface SampleTokenDecimalsDefinition {
  out: BigNumber;
  events: ContractsEvents;
}

export interface SampleTokenDecreaseApprovalDefinition {
  in: SampleTokenDecreaseApprovalInput;
  out: boolean;
  events: ContractsEvents;
}

export interface SampleTokenBalanceOfDefinition {
  in: string;
  out: BigNumber;
  events: ContractsEvents;
}

export interface SampleTokenSymbolDefinition {
  out: string;
  events: ContractsEvents;
}

export interface SampleTokenTransferDefinition {
  in: SampleTokenTransferInput;
  out: boolean;
  events: ContractsEvents;
}

export interface SampleTokenIncreaseApprovalDefinition {
  in: SampleTokenIncreaseApprovalInput;
  out: boolean;
  events: ContractsEvents;
}

export interface SampleTokenAllowanceDefinition {
  in: SampleTokenAllowanceInput;
  out: BigNumber;
  events: ContractsEvents;
}

export interface SampleTokenApproveInput {
  _spender: string;
  _value: NumberLike;
}

export interface SampleTokenTransferFromInput {
  _from: string;
  _to: string;
  _value: NumberLike;
}

export interface SampleTokenDecreaseApprovalInput {
  _spender: string;
  _subtractedValue: NumberLike;
}

export interface SampleTokenTransferInput {
  _to: string;
  _value: NumberLike;
}

export interface SampleTokenIncreaseApprovalInput {
  _spender: string;
  _addedValue: NumberLike;
}

export interface SampleTokenAllowanceInput {
  _owner: string;
  _spender: string;
}

export interface SampleTokenApprovalPayload {
  owner: string;
  spender: string;
  value: BigNumber;
}

export interface SampleTokenApprovalEvent {
  type: 'Approval';
  payload: SampleTokenApprovalPayload;
  meta: EventMetadata;
}

export interface SampleTokenTransferPayload {
  from: string;
  to: string;
  value: BigNumber;
}

export interface SampleTokenTransferEvent {
  type: 'Transfer';
  payload: SampleTokenTransferPayload;
  meta: EventMetadata;
}
