import { curry } from 'ramda';
import { createWeb3, bind } from '../utils';
import { CurriedFunction2 } from 'ramda';
import { bindNodeCallback, Observable } from 'rxjs';
import { Provider } from '../interfaces';

export const getTransaction = curry((provider: Provider, hash: string) => {
  const web3 = createWeb3(provider);
  const callback = bind(web3.eth.getTransaction, web3);
  return bindNodeCallback(callback)(hash);
});
