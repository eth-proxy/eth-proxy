import { evolve } from 'ramda';
import { formatQuantity } from '../../formatters';
import { ContractRequestParams, RequestInputParams } from '../../interfaces';

export function formatRequestInput(params: RequestInputParams) {
  return evolve(
    {
      gasPrice: formatQuantity,
      gas: formatQuantity,
      value: formatQuantity
    },
    params
  ) as ContractRequestParams;
}
