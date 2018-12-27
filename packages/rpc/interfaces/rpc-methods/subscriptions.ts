import { BaseRpcRequest, Rpc } from '../rpc';
import { Data } from '../primitives';
import { RawLogFilter } from '../raw-entities';

export type NewHeadsParams = ['newHeads', { includeTransactions: boolean }?];
export type LogsParams = ['logs', RawLogFilter];
export type NewPendingTransactionsParams = ['newPendingTransactions'];
export type SyncingParams = ['syncing'];

export type SubscriptionParams =
  | NewHeadsParams
  | LogsParams
  | NewPendingTransactionsParams
  | SyncingParams;

/**
 * https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB#newheads
 */
export interface SubscribeRequest extends BaseRpcRequest {
  method: 'eth_subscribe';
  params: SubscriptionParams;
}

export type EthSubscribe = Rpc<SubscribeRequest, Data>;

/**
 * https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB#cancel-subscription
 */
export interface UnsubscribeRequest extends BaseRpcRequest {
  method: 'eth_unsubscribe';
  params: [Data];
}

export type EthUnsubscribe = Rpc<UnsubscribeRequest, boolean>;

export type SubscriptionMethod = EthSubscribe | EthUnsubscribe;
