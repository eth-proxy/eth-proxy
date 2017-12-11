export * from "./decode-logs";
import * as Web3 from "web3";
import { ascend, sortWith, path } from "ramda";
import 'rxjs/add/operator/let';

export function createWeb3Instance(provider: Web3.Provider) {
  const web3 = new Web3();
  web3.setProvider(provider);
  return web3;
}

export const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

export const networkNameFromId = (networkId: string) => {
  switch (networkId) {
    case "1":
      return "Main";
    case "2":
      return "Morden";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    case "42":
      return "Kovan";
    default:
      return "Unknown";
  }
};

export const isString = (x): x is string => (typeof x === 'string' || x instanceof String);

export const isMain = (networkId: string) =>
  networkNameFromId(networkId) === "Main";

export function idFromEvent({ meta: { transactionHash, transactionIndex, logIndex } }: any) {
  return transactionHash + transactionIndex + logIndex
}


export const sortEvents = sortWith<any>([
  ascend(path(['meta', 'blockNumber'])),
  ascend(path(['meta', 'transactionIndex'])),
  ascend(path(['meta', 'logIndex']))
]);

export function getMethodAbi(abi: Web3.AbiDefinition[], method: string) {
  return abi.find(({ name }) => caseInsensitiveCompare(name, method));
}