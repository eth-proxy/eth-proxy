import * as HttpProvider from 'web3/lib/web3/httpprovider';
import { Provider } from '../interfaces';

export const httpProvider = (url?: string): Provider => {
  return new HttpProvider(url);
};
