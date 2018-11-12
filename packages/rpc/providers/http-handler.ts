import * as HttpProvider from 'web3/lib/web3/httpprovider';
import { asHandler } from './utils';
import { Provider } from '../interfaces';
import { pipe } from 'ramda';

export const httpProvider = (url?: string): Provider => {
  return new HttpProvider(url);
};

export const httpHandler = pipe(
  httpProvider,
  asHandler
);
