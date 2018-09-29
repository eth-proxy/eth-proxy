import { RawLog, Log } from '../../interfaces';
import { evolve } from 'ramda';
import { ethHexToNumber } from '../../utils';

export function fromLog(log: RawLog): Log {
  return evolve(
    {
      blockNumber: ethHexToNumber,
      logIndex: ethHexToNumber,
      transactionIndex: ethHexToNumber
    },
    log
  );
}
