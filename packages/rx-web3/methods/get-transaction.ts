import { curry } from 'ramda';
import * as Web3 from 'web3';
import { createWeb3, bind } from '../utils';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';
import { CurriedFunction2 } from 'ramda';
import { Observable } from 'rxjs/Observable';

export const getTransaction = curry((provider: Web3.Provider, hash: string) => {
  const web3 = createWeb3(provider);
  const callback = bind(web3.eth.getTransaction, web3);
  return bindNodeCallback(callback)(hash);
});