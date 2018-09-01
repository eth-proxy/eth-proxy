import * as Web3 from 'web3';
import { toHex } from '../utils';
import { Observable } from 'rxjs';
import { curry } from 'ramda';

interface SignArgs {
  data: string;
  address: string;
}

export const sign = curry(
  (provider: Web3.Provider, { address, data }: SignArgs) => {
    return new Observable(obs => {
      provider.sendAsync(
        {
          method: 'personal_sign',
          params: [toHex(data), address]
        },
        function(err, response: any) {
          if (err) {
            return obs.error(err);
          }
          return obs.next(response.result);
        }
      );
    });
  }
);
