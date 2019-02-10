import { SubscriptionData } from './rpc';
import { RawBlock, RawLog, RawSyncingState } from './raw-entities';
import { Data } from './primitives';

export interface SubscriptionEvent<M, R> {
  method: M;
  data: SubscriptionData<R>;
}

export type NewHeadsEvent = SubscriptionEvent<'newHeads', RawBlock>;
export type LogsEvent = SubscriptionEvent<'logs', RawLog>;
export type NewPendingTransactionsEvent = SubscriptionEvent<
  'newPendingTransactions',
  Data
>;
export type SyncingEvent = SubscriptionEvent<'syncing', RawSyncingState>;

export type RpcSubscriptionEvent =
  | NewHeadsEvent
  | LogsEvent
  | NewPendingTransactionsEvent
  | SyncingEvent;
