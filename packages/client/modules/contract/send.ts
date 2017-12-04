import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getContractFromRef,
  getDefaultTxParams
} from "../../store";
import { map } from "rxjs/operators";
import { caseInsensitiveCompare, isString } from "../../utils";
import { executeMethod } from "@eth-proxy/rx-web3";
import { ContractRef, ContractInfo } from "../../model";

export interface SendContext {
  web3: Web3;
  defaultTxParams: any;
  contract: ContractInfo;
}

export interface SendRequest {
  contractRef: ContractRef;
  method: string;
  args: any;
  tx_params: any;
}

export const send = (
  { web3, defaultTxParams, contract: { abi, address, name } }: SendContext,
  { contractRef, method, args, tx_params } : SendRequest
) => {
  const atAddress = isString(contractRef) ? address : contractRef.address;
  const web3MethodRef = web3.eth.contract(abi).at(atAddress)[method];

  const { inputs } = abi.find(({ name }) =>
    caseInsensitiveCompare(name, method)
  );

  const orderedArgs = formatArgs(inputs, arraifyArgs(inputs, args));

  const txParams = {
    ...defaultTxParams,
    ...tx_params
  };

  return executeMethod(web3MethodRef, orderedArgs, txParams).pipe(
    map(data => ({
      contractName: name,
      address,
      method,
      txParams,
      args,
      data
    }))
  );
};

function arraifyArgs(inputs: Web3.FunctionParameter[], args): any[] {
  if (inputs.length === 1) {
    return [args];
  }
  return orderArgs(inputs, args);
}

function orderArgs(inputs: Web3.FunctionParameter[], args: any) {
  return inputs.map(({ name }) => {
    const arg = args[name];
    if (!arg) {
      throw Error("Invalid Argument! " + name);
    }
    return arg;
  });
}

function formatArgs(inputs: Web3.FunctionParameter[], args: any[]) {
  return inputs.map(({ name, type }, index) => {
    const argValue = args[index];
    if (!argValue) {
      throw Error("Invalid Argument! " + name);
    }
    return formatArg(type, argValue);
  });
}

function formatArg(type, value: any) {
  if (type === "bool") {
    return Boolean(value);
  }
  return value.toString();
}
