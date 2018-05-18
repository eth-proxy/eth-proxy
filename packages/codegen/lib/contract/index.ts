import { map } from 'ramda';
import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { TruffleJson, FunctionDescription } from '../../interfaces';

export type CreateContractInterface = (
  json: TruffleJson,
  fs: FunctionDescription[]
) => InterfaceDeclarationStructure;

export const createContractInterfaces = (createFn: CreateContractInterface) => (
  contracts: TruffleJson[]
) =>
  map((json: TruffleJson): InterfaceDeclarationStructure => {
    const functions = json.abi.filter(
      ({ type }) => type === 'function'
    ) as FunctionDescription[];

    return createFn(json, functions);
  }, contracts);
