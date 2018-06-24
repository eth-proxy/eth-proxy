import * as Web3 from 'web3';
import { createWeb3, bind } from '../utils';
import { Observable, bindNodeCallback } from 'rxjs';
import { CurriedFunction2 } from 'ramda';

export function getNetwork(provider: Web3.Provider) {
  const web3 = createWeb3(provider);
  const callback = bind(web3.version.getNetwork, web3);
  return bindNodeCallback(callback)();
}
