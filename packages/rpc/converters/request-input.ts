import { evolve } from 'ramda';
import { toQuantity } from './quantity';
import { ContractRequestParams, RequestInputParams } from '../interfaces';

export function toRequestInput(params: RequestInputParams) {
  return evolve(
    {
      gasPrice: toQuantity,
      gas: toQuantity,
      value: toQuantity
    },
    params as Required<RequestInputParams>
  ) as ContractRequestParams;
}
