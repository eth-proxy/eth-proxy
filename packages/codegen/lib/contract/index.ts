import {
  MethodDeclarationStructure,
  ParameterDeclarationStructure
} from 'ts-simple-ast';
import { map } from 'ramda';
import {
  toOutputName,
  toInputName,
  solidityToJsOutputType,
  solidityToJsInputType
} from '../../lib';

import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  TypeAliasDeclarationStructure
} from 'ts-simple-ast';
import { chain, filter } from 'ramda';

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
