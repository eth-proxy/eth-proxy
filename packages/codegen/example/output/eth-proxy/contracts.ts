/* tslint:disable */
declare module '@eth-proxy/client' {
  const C: RequestFactory<Contracts>;
  function entity<T>(
    model: EntityModel<T, EventsByType, Contracts>
  ): EntityModel<T, EventsByType, Contracts>;
}
import { BigNumber } from 'bignumber.js';
import { EventMetadata, RequestFactory, EntityModel } from '@eth-proxy/client';

export interface EventsByType {
  ERC20: ERC20EventsByType;
}

export interface ERC20EventsByType {
  Approval: ERC20ApprovalEvent;
  Transfer: ERC20TransferEvent;
}

export interface EventsByType {
  Approval: ERC20ApprovalEvent;
  Transfer: ERC20TransferEvent;
}

export interface TransactionOptions {
  from?: string;
  value?: NumberLike;
  gas?: NumberLike;
  gasPrice?: NumberLike;
}

export interface Contracts {
  ERC20: ERC20;
}

export interface ERC20 {
  approve: ERC20ApproveDefinition;
  totalSupply: ERC20TotalSupplyDefinition;
  transferFrom: ERC20TransferFromDefinition;
  balanceOf: ERC20BalanceOfDefinition;
  transfer: ERC20TransferDefinition;
  allowance: ERC20AllowanceDefinition;
}

export interface ERC20ApproveDefinition {
  in: ERC20ApproveInput;
  out: boolean;
  events: ContractsEvents;
}

export interface ERC20TotalSupplyDefinition {
  out: BigNumber;
  events: ContractsEvents;
}

export interface ERC20TransferFromDefinition {
  in: ERC20TransferFromInput;
  out: boolean;
  events: ContractsEvents;
}

export interface ERC20BalanceOfDefinition {
  in: string;
  out: BigNumber;
  events: ContractsEvents;
}

export interface ERC20TransferDefinition {
  in: ERC20TransferInput;
  out: boolean;
  events: ContractsEvents;
}

export interface ERC20AllowanceDefinition {
  in: ERC20AllowanceInput;
  out: BigNumber;
  events: ContractsEvents;
}

export interface ERC20ApproveInput {
  spender: string;
  value: NumberLike;
}

export interface ERC20TransferFromInput {
  from: string;
  to: string;
  value: NumberLike;
}

export interface ERC20TransferInput {
  to: string;
  value: NumberLike;
}

export interface ERC20AllowanceInput {
  owner: string;
  spender: string;
}

export interface ERC20ApprovalPayload {
  owner: string;
  spender: string;
  value: BigNumber;
}

export interface ERC20ApprovalEvent {
  type: 'Approval';
  payload: ERC20ApprovalPayload;
  meta: EventMetadata;
}

export interface ERC20TransferPayload {
  from: string;
  to: string;
  value: BigNumber;
}

export interface ERC20TransferEvent {
  type: 'Transfer';
  payload: ERC20TransferPayload;
  meta: EventMetadata;
}

export type ERC20Events = ERC20ApprovalEvent | ERC20TransferEvent;
export type ContractsEvents = ERC20Events;
export type NumberLike = BigNumber | string | number;
