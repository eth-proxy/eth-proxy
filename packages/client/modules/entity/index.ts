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

import { EntityModel } from './model';

const EMPTY_SNAPSHOT = {};

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
  const getEntitiesFromModel = <T>(
    model: EntityModel<T, {}, {}>,
    seedSelector: (state: App) => { [id: string]: T } = () => EMPTY_SNAPSHOT
  ) => {
    return createSelector(
      seedSelector,
      getContractsFromRefs(keys(model)),
      getAllEventsSorted,
      (seed, contracts, allEvents) => {
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
        }, seed);
      }
    );
  };

  const getEntitiesFromModelOptimistic = <T>(
    model: EntityModel<T, {}, {}>,
    seedSelector: (state: App) => { [id: string]: T } = () => EMPTY_SNAPSHOT
  ) => {
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
      getEntitiesFromModel(model, seedSelector),
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
  const getListFromModelOptimistic = <T>(
    model: EntityModel<T, {}, {}>,
    seedSelector?: (state: App) => { [id: string]: T }
  ) =>
    createSelector(getEntitiesFromModelOptimistic(model, seedSelector), values);

  return {
    getEntitiesFromModel,
    getEntitiesFromModelOptimistic,
    getListFromModelOptimistic
  };
};

export * from './model';
