import { curry } from 'ramda';

const Coder = require('web3/lib/solidity/coder');

export const encodeParams = curry((types: string[], params: any[]) => {
  return Coder.encodeParams(types, params);
});
