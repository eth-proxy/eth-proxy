import { createSelector } from 'reselect';
import {
  filter,
  keys,
  indexBy,
  pipe,
  mapObjIndexed,
  values,
  flatten,
  omit,
  map
} from 'ramda';

import { State, getSelectors as getInternalSelectors } from '../store';
import * as fromEvents from '../modules/events';
import * as fromTransactions from '../modules/transaction';

import { EntityModel } from './model';
import { ContractInfo } from '../modules/schema';

const EMPTY_SNAPSHOT = {
  entities: {},
  toBlock: -1
};

export interface Snapshot<T> {
  entities: { [id: string]: EntitySnapshot<T> };
  toBlock: number;
}

export interface EntitySnapshot<T> {
  toBlock: number;
  entity: T;
}

export const getSelectors = <App>(getModule: (state: App) => State) => {
  const { getAllEvents } = fromEvents.getSelectors(
    createSelector(getModule, m => m.events)
  );

  const { getPendingTransactions } = fromTransactions.getSelectors(
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
    snapshotSelector: (state: App) => Snapshot<T> = () => EMPTY_SNAPSHOT
  ) => {
    return createSelector(
      snapshotSelector,
      getContractsFromRefs(keys(model)),
      getAllEvents,
      (snapshot, contracts, allEvents) => {
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

        const handlers = pipe(
          mapObjIndexed(values),
          values,
          flatten
        )(model);
        const hasRoot = handlers.some((x: any) => x.root);
        const isEventInvolved = (x: fromEvents.DecodedEvent) =>
          eventTypes.find(
            ({ type, address }) =>
              type === x.type &&
              address === x.meta.address &&
              x.meta.blockNumber > snapshot.toBlock
          );

        const initialState = mapObjIndexed(e => e.entity, snapshot.entities);
        return allEvents.filter(isEventInvolved).reduce((state: any, e) => {
          const handler = model[byAddress[e.meta.address].name][e.type];
          const id = handler.identity(e.payload);

          const entitySnapshot = snapshot.entities[id];
          const includedInSnapshot =
            entitySnapshot && e.meta.blockNumber < entitySnapshot.toBlock;

          const canApply =
            !includedInSnapshot && (!!state[id] || handler.root || !hasRoot);

          const next = canApply && handler.handle(state[id], e.payload, e.meta);

          return next
            ? {
                ...state,
                [id]: next
              }
            : state;
        }, initialState);
      }
    );
  };

  const getEntitiesFromModelOptimistic = <T>(
    model: EntityModel<T, {}, {}>,
    snapshotSelector: (state: App) => Snapshot<T> = () => EMPTY_SNAPSHOT
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

    const handlers = pipe(
      mapObjIndexed(values),
      values,
      flatten
    )(model);
    const hasRoot = handlers.some((x: any) => x.root);

    return createSelector(
      getEntitiesFromModel(model, snapshotSelector),
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
    snapshotSelector?: (app: App) => Snapshot<T>
  ) =>
    createSelector(
      getEntitiesFromModelOptimistic(model, snapshotSelector),
      values
    );

  return {
    getEntitiesFromModel,
    getEntitiesFromModelOptimistic,
    getListFromModelOptimistic
  };
};

export * from './model';
