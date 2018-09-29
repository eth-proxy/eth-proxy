import { pipe } from 'ramda';
import { ethHexToNumber } from '../../utils';

export const ethHexToBoolean = pipe(
  ethHexToNumber,
  x => !!x
);
