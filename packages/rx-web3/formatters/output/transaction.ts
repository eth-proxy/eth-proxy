import { RawTransaction, Transaction } from '../../interfaces';
import { evolve, when, isNil } from 'ramda';
import { ethHexToBN, ethHexToNumber, isNotNil } from '../../utils';

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
