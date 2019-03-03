import { EMPTY } from 'rxjs';
import { Subprovider, JsonRpcError } from '@eth-proxy/rpc';
import {
  GET_SCHEMA,
  EthProxyGetSchema,
  ContractInfo
} from '../methods/get-schema';

const methods = [GET_SCHEMA];

export type SchemaLoader = ({
  contractName
}: {
  contractName: string;
}) => Promise<ContractInfo>;

export function schemaSubprovider(loader: SchemaLoader): Subprovider {
  const send: any = ({
    params: [{ contractName }],
    id,
    jsonrpc,
    method
  }: EthProxyGetSchema['request']): Promise<EthProxyGetSchema['response']> => {
    switch (method) {
      case GET_SCHEMA:
        return loader({ contractName })
          .then(schema => {
            return {
              id,
              jsonrpc,
              result: {
                genesisBlock: 0,
                name: contractName,
                ...schema
              }
            };
          })
          .catch(() => {
            throw new JsonRpcError({
              code: 0,
              message: 'Could not load contract schema'
            });
          });

      default:
        throw Error('Not supported');
    }
  };

  return {
    accept: req => methods.includes(req.method),
    send,
    observe: () => EMPTY,
    disconnect: () => {}
  };
}
