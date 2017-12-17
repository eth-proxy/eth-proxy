/* tslint:disable */
import BigNumber from 'bignumber.js';

export interface ERC20ApprovalPayload {
  owner: string;
  spender: string;
  value: BigNumber;
}

export interface ERC20ApprovalEvent extends EventMetadata {
  event: 'Approval';
  args: ERC20ApprovalPayload;
}

export interface ERC20TransferPayload {
  from: string;
  to: string;
  value: BigNumber;
}

export interface ERC20TransferEvent extends EventMetadata {
  event: 'Transfer';
  args: ERC20TransferPayload;
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

export type ERC20Events = ERC20ApprovalEvent | ERC20TransferEvent;
export type ContractsEvents = ERC20Events;
