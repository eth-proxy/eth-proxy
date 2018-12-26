import { RawBlock, Block, NumberLike } from '../interfaces';
import { map, when, evolve } from 'ramda';
import {
  ethHexToBN,
  ethHexToNumber,
  isNotString,
  isNotNil,
  isTag
} from '../utils';
import { fromTransaction } from './transaction';
import { toQuantity } from './quantity';

export function toBlockNr(input: string | NumberLike) {
  return isTag(input) ? input : toQuantity(input);
}

export function fromBlock(block: RawBlock): Block {
  return evolve(
    {
      gasLimit: ethHexToNumber,
      gasUsed: ethHexToNumber,
      size: ethHexToNumber,
      timestamp: ethHexToNumber,
      number: when(isNotNil, ethHexToNumber),
      difficulty: ethHexToBN,
      totalDifficulty: ethHexToBN,
      transactions: map<any, Block['transactions']>(
        when(isNotString, fromTransaction)
      )
    },
    block
  );
}
