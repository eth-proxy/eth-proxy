import { createWeb3, bind } from '../utils';
import { CurriedFunction2 } from 'ramda';
import { bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { head } from 'ramda';
import { Provider } from '../interfaces';

export function getDefaultAccount(provider: Provider) {
  const web3 = createWeb3(provider);
  const callback = bind(web3.eth.getAccounts, web3);

  return bindNodeCallback(callback)().pipe(map(value => head(value)));
}
