import { map } from 'ramda';
import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { TruffleJson } from '../../interfaces';
import { isFunctionAbi, FunctionDescription } from '@eth-proxy/rpc';

export type CreateContractInterface = (
  json: TruffleJson,
  fs: FunctionDescription[]
) => InterfaceDeclarationStructure;

export const createContractInterfaces = (createFn: CreateContractInterface) => (
  contracts: TruffleJson[]
) =>
  map((json: TruffleJson): InterfaceDeclarationStructure => {
    const functions = json.abi.filter(isFunctionAbi);

    return createFn(json, functions);
  }, contracts);
