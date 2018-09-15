import { createWeb3, bind } from '../utils';
import { CurriedFunction2, curry, isNil } from 'ramda';
import { bindNodeCallback, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Provider } from '../interfaces';

export const getBlock = curry(
  (provider: Provider, filter: 'latest' | string | number) => {
    const web3 = createWeb3(provider);
    const callback = bind(web3.eth.getBlock, web3);

    return bindNodeCallback(callback)(filter).pipe(
      tap(result => {
        if (isNil(result)) {
          throw Error('Invalid block');
        }
      })
    );
  }
);
