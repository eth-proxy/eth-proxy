import * as Web3 from 'web3';
import { createWeb3, bind } from '../utils';
import { CurriedFunction2 } from 'ramda';
import { bindNodeCallback, Observable } from 'rxjs';

export function getNetwork(provider: Web3.Provider) {
  const web3 = createWeb3(provider);
  const callback = bind(web3.version.getNetwork, web3);
  return bindNodeCallback(callback)();
}
