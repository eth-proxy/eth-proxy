import { pipe } from 'ramda';
import { prefix0x } from './common';

const cryptoJSSha3 = require('crypto-js/sha3');

export function sha3(value: string) {
  return pipe(
    _cryptoSha3,
    prefix0x
  )(value);
}

function _cryptoSha3(value: string): string {
  return cryptoJSSha3(value, {
    outputLength: 256
  }).toString();
}
