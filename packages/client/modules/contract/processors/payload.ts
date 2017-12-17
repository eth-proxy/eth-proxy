import * as Web3 from "web3";
import { isNil, contains } from "ramda";

export function formatPayload(userPayload, { inputs }: Web3.AbiDefinition) {
  return formatArgs(inputs, arraifyArgs(inputs, userPayload));
}

function arraifyArgs(inputs: Web3.FunctionParameter[], args): any[] {
  if (inputs.length === 1) {
    return [args];
  }
  return orderArgs(inputs, args);
}

function orderArgs(inputs: Web3.FunctionParameter[], args: any) {
  return inputs.map(({ name }) => {
    const arg = args[name];
    if (isNil(arg)) {
      throw Error("Invalid Argument! " + name);
    }
    return arg;
  });
}

function formatArgs(inputs: Web3.FunctionParameter[], args: any[]) {
  return inputs.map(({ name, type }, index) => {
    const argValue = args[index];
    if (isNil(argValue)) {
      throw Error("Invalid Argument! " + name);
    }
    return formatArg(type, argValue);
  });
}

function formatArg(type, value: any) {
  if(contains('[]', type)) {
    return value.map(arg => formatArg(type.replace('[]', ''), arg))
  }
  if (type === "bool") {
    return Boolean(value);
  }
  return value.toString();
}
