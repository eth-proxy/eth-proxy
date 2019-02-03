import { ascend, sortWith, path, equals } from 'ramda';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { DecodedEvent } from '@eth-proxy/rpc';
import { DataError, DataLoaded, Data, DataNotAsked } from '../interfaces';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export const networkNameFromId = (networkId: string) => {
  switch (networkId) {
    case '1':
      return 'Main';
    case '2':
      return 'Morden';
    case '3':
      return 'Ropsten';
    case '4':
      return 'Rinkeby';
    case '42':
      return 'Kovan';
    default:
      return 'Unknown';
  }
};

export const isString = (x: unknown): x is string =>
  typeof x === 'string' || x instanceof String;

export const isMain = (networkId: string) =>
  networkNameFromId(networkId) === 'Main';

export function idFromEvent({
  meta: { transactionHash, transactionIndex, logIndex }
}: DecodedEvent) {
  return transactionHash + transactionIndex + logIndex;
}

export const sortEvents = sortWith<DecodedEvent>([
  ascend(path(['meta', 'blockNumber'])),
  ascend(path(['meta', 'transactionIndex'])),
  ascend(path(['meta', 'logIndex']))
]);

export const createLengthEqualSelector = createSelectorCreator(
  defaultMemoize,
  (x: any, y: any) => x && y && x.length === y.length
);

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);

export function dataError(error: any): DataError {
  return {
    status: 'Error',
    value: error
  };
}

export function dataOf<T>(value: T): DataLoaded<T> {
  return {
    status: 'Loaded',
    value
  };
}

export function getLoadedValue() {
  return <T>(data$: Observable<Data<T>>) =>
    data$.pipe(
      tap(x => {
        if (isError(x)) {
          throw Error(x.value);
        }
      }),
      filter(isLoaded),
      map(x => x.value)
    );
}

export const isError = (data: Data<any>): data is DataError =>
  data.status === 'Error';

export const isLoaded = <T>(data: Data<T>): data is DataLoaded<T> =>
  data.status === 'Loaded';

export const isNotAsked = <T>(data: Data<T>): data is DataNotAsked =>
  data.status === 'NotAsked';

export * from './observable-store';
export * from './of-type';
