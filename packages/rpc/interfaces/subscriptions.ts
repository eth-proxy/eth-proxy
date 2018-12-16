import { SubscriptionData } from './rpc';
import { RawBlock, RawLog, RawSyncingState } from './raw-entities';
import { Data } from './primitives';

// Does it contain all props?
export type NewHeadsData = SubscriptionData<RawBlock>;
export type LogsData = SubscriptionData<RawLog>;
export type NewPendingTransactionsData = SubscriptionData<Data>;
export type SyncingData = SubscriptionData<RawSyncingState>;
