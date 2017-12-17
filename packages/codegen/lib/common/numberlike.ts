import { TypeAliasDeclarationStructure } from "ts-simple-ast";

export function numberLike(): TypeAliasDeclarationStructure {
  return {
    name: 'NumberLike',
    type: 'BigNumber | string | number'
  }
}
