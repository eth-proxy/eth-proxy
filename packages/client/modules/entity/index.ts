import { createSelector } from 'reselect';
import {
  filter,
  keys,
  indexBy,
  pipe,
  mapObjIndexed,
  values,
  flatten,
  omit
} from 'ramda';
import * as Web3 from 'web3';

import { State } from '../../store';
import { getSelectors as getEventsSelectors } from '../../store/reducers/events';
import { getSelectors as getTransactionSelectors } from '../../store/reducers/transactions';
import {
  LoadingRecord,
  ErrorRecord,
  InitializedTransaction,
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  EventMetadata,
  BlockchainEvent,
  ContractInfo,
  getSelectors as getInternalSelectors
} from '../../store';

import { sortEvents } from '../../utils';

export const getSelectors = <App>(getModule: (state: App) => State) => {
  const { getAllEventsSorted } = getEventsSelectors(
    createSelector(getModule, m => m.events)
  );

  const { getPendingTransactions } = getTransactionSelectors(
    createSelector(getModule, m => m.transactions)
  );

  const getPendingTransactionsOfType = (
    types: { interfaceName: string; method: string }[]
  ) =>
    createSelector(getPendingTransactions, ts =>
      filter(
        t =>
          !!types.find(
            x => x.method === t.method && t.contractName === x.interfaceName
          ),
        ts
      )
    );

  const { getContractsFromRefs } = getInternalSelectors<App>(getModule);
  interface EventType {
    type: string;
    address: string;
  }
  const getEntitiesFromModel = <T>(model: EntityModel<T, {}, {}>) => {
    return createSelector(
      getContractsFromRefs(keys(model)),
      getAllEventsSorted,
      (contracts, allEvents) => {
        if (contracts.some((x: any) => !x || x.loading || x.error)) {
          return {};
        }
        const byAddress = indexBy(x => x.address, contracts as ContractInfo[]);

        const eventTypes = pipe(
          mapObjIndexed((handlers, interfaceName) => {
            const { address, abi } = (contracts as ContractInfo[]).find(
              x => x.name === interfaceName
            );
            return keys(handlers)
              .filter(type =>
                abi.find(x => x.type === 'event' && x.name === type)
              )
              .map(type => ({ type, address }));
          }),
          values,
          x => flatten<EventType>(x)
        )(model);

        const handlers = pipe(mapObjIndexed(values), values, flatten)(model);
        const hasRoot = handlers.some(x => x.root);
        const isEventInvolved = (x: BlockchainEvent) =>
          eventTypes.find(
            ({ type, address }) => type === x.type && address === x.meta.address
          );

        return allEvents.filter(isEventInvolved).reduce((state: any, e) => {
          const handler = model[byAddress[e.meta.address].name][e.type];
          const id = handler.identity(e.payload);

          const canApply = !!state[id] || handler.root || !hasRoot;
          const next = canApply && handler.handle(state[id], e.payload, e.meta);

          return next
            ? {
                ...state,
                [id]: next
              }
            : omit([id.toString()], state);
        }, {});
      }
    );
  };

  const getEntitiesFromModelOptimistic = <T>(model: EntityModel<T, {}, {}>) => {
    const transactionTypes = pipe(
      mapObjIndexed((handlers, interfaceName) =>
        keys(handlers).map(method => ({ method, interfaceName }))
      ),
      values,
      flatten
    )(model) as {
      method: string;
      interfaceName: string;
    }[];

    const handlers = pipe(mapObjIndexed(values), values, flatten)(model);
    const hasRoot = handlers.some((x: any) => x.root);

    return createSelector(
      getEntitiesFromModel(model),
      getPendingTransactionsOfType(transactionTypes),
      (entities, transactions): { [id: string]: T } => {
        return transactions.reduce((state: any, t) => {
          const handler = model[t.contractName][t.method];
          const id = handler.identity(t.args, t);

          const canApply = !!state[id] || handler.root || !hasRoot;
          const next = canApply && handler.handle(state[id], t.args, t);

          return next
            ? {
                ...state,
                [id]: next
              }
            : omit([id.toString()], state);
        }, entities);
      }
    );
  };
  const getListFromModelOptimistic = <T>(model: EntityModel<T, {}, {}>) =>
    createSelector(getEntitiesFromModelOptimistic(model), values);

  return {
    getEntitiesFromModel,
    getEntitiesFromModelOptimistic,
    getListFromModelOptimistic
  };
};

export interface TransactionHandler<E, MD> {
  handle: (
    state: E,
    next: MD extends { in: any } ? MD['in'] : never,
    transaction: InitializedTransaction | TransactionWithHash
  ) => E;
  identity: (
    e: MD extends { in: any } ? MD['in'] : never,
    transaction: InitializedTransaction | TransactionWithHash
  ) => string | number;
  root?: boolean;
}
export interface EventHandler<Entity, Event> {
  handle: (
    state: Entity,
    next: Event extends { payload: infer Payload } ? Payload : never,
    meta: EventMetadata
  ) => Entity;
  identity: (
    e: Event extends { payload: infer Payload } ? Payload : never
  ) => string | number;
  root?: boolean;
}

export declare type EntityModel<
  E,
  EventsByType extends {},
  Contracts extends {}
> =
  | {
      [C in keyof Partial<EventsByType>]: {
        [P in keyof Partial<EventsByType[C]>]: EventHandler<
          E,
          EventsByType[C][P]
        >
      }
    }
  | {
      [C in keyof Partial<Contracts>]: {
        [P in keyof Partial<Contracts[C]>]: TransactionHandler<
          E,
          Contracts[C][P]
        >
      }
    };
