import { curry } from 'ramda';
import * as Web3 from 'web3';
import { createWeb3, bind } from '../utils';
import { bindNodeCallback } from 'rxjs';

import { CurriedFunction2 } from 'ramda';
import { Observable } from 'rxjs';
import { BigNumber } from 'bignumber.js';

export const getBalance = curry((provider: Web3.Provider, account: string) => {
  const web3 = createWeb3(provider);
  const callback = bind(web3.eth.getBalance, web3);

  return bindNodeCallback(callback)(account);
});
