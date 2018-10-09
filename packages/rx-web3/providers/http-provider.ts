import * as HttpProvider from 'web3/lib/web3/httpprovider';
import { Provider } from '../interfaces';

export const httpProvider = (url?: string, customHeaders?: any): Provider => {
  return new HttpProvider(url, 0, undefined, undefined, customHeaders);
};
