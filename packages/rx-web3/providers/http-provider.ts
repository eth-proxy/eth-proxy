import * as Web3 from 'web3';
import { Provider } from '../interfaces';

export const httpProvider = (url?: string): Provider => {
  return new Web3.providers.HttpProvider(url);
};
