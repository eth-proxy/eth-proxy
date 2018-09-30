import { RawBlock, Block } from '../../interfaces';
import { evolve, map, when } from 'ramda';
import { ethHexToBN, ethHexToNumber, isNotString, isNotNil } from '../../utils';
import { fromTransaction } from './transaction';

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
      transactions: map<RawBlock['transactions'], Block['transactions']>(
        when(isNotString, fromTransaction)
      )
    },
    block
  );
}
