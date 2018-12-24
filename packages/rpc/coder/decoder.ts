import { curry } from 'ramda';

const Coder = require('web3/lib/solidity/coder');

export const decodeParams = curry((types: string[], params: string) => {
  return Coder.decodeParams(types, params);
});
