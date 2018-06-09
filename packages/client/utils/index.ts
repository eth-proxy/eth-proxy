import { ascend, sortWith, path, equals, identity } from 'ramda';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { DecodedEvent } from '../modules/events';
import { EthProxyInterceptors } from '../model';

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

export const isString = (x): x is string =>
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
  (x, y) => x && y && x.length === y.length
);

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);

export const getInterceptor = (key: keyof EthProxyInterceptors, options: any) =>
  ((options.interceptors as any) || {})[key] || identity;
