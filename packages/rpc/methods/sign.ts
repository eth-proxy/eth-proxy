import { send } from '../utils';
import { curry } from 'ramda';
import { Provider } from '../interfaces';
import { utf8ToHex } from '../converters';

interface SignArgs {
  data: string;
  address: string;
}

export const sign = curry((provider: Provider, { address, data }: SignArgs) => {
  return send(provider)({
    method: 'personal_sign',
    params: [utf8ToHex(data), address]
  });
});
