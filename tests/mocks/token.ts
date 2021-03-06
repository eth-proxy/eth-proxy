import {
  C,
  RequestFactory,
  EthProxy,
  createProxy,
  ethDeploy
} from '@eth-proxy/client';
import { Contracts } from '../contracts';
import { httpSubprovider, getReceipt } from '@eth-proxy/rpc';

export const { SampleToken } = (C as any) as RequestFactory<Contracts>;

export const myToken = {
  _name: 'myToken',
  _symbol: 'myTokenSymbol',
  _decimals: 18,
  supply: 10 * 10 ** 18
};

export function deploySampleToken(proxy: EthProxy<Contracts>) {
  return ethDeploy(proxy, {
    interface: 'SampleToken',
    payload: myToken,
    gas: 7000000
  }).then(getReceipt(proxy));
}

export const ethProxy = () => {
  return createProxy<Contracts>(httpSubprovider(), {
    contractSchemaLoader: ({ contractName }) =>
      import(`../schemas/${contractName}.json`)
  });
};
