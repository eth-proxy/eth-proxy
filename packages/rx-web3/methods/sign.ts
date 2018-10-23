import { toHex, send } from '../utils';
import { curry } from 'ramda';
import { Provider } from '../interfaces';

interface SignArgs {
  data: string;
  address: string;
}

export const sign = curry(({ address, data }: SignArgs, provider: Provider) => {
  return send(provider)({
    method: 'personal_sign',
    params: [toHex(data), address]
  });
});
