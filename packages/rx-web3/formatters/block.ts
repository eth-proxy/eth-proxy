import { Block, RawTransaction, Transaction } from '../interfaces';
import { evolve, map, when, complement } from 'ramda';
import { ethHexToBN, ethHexToNumber, isNotString, isNotNil } from '../utils';
import { RawBlock } from '../interfaces';

export function fromTransaction(tx: RawTransaction): Transaction {
  return evolve(
    {
      blockNumber: when(isNotNil, ethHexToNumber),
      transactionIndex: when(isNotNil, ethHexToNumber),
      nonce: ethHexToNumber,
      gas: ethHexToNumber,
      gasPrice: ethHexToBN,
      value: ethHexToBN
    },
    tx
  );
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
      transactions: map<RawBlock['transactions'], Block['transactions']>(
        when(isNotString, fromTransaction)
      )
    },
    block
  );
}
