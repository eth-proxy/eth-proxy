export * from "./decode-logs";
import * as Web3 from "web3";
import { map } from "rxjs/operators";
import { pipe, concat } from "ramda";
import { Observable } from "rxjs/Observable";
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

export const isMain = (networkId: string) =>
  networkNameFromId(networkId) === "Main";

const createNetworkPrefix = (networkId: string) =>
  isMain(networkId) ? "" : networkNameFromId(networkId);

const createEtherscanBaseUrl = (networkPrefix: string) =>
  `https://${networkPrefix}etherscan.io`;

export function networkToTxUrl(tx: string, params?: string) {
  return createEthersanUrl(`$/tx/${tx}?${params}`)
}
export function networkToAddressUrl(address: string, params?: string) {
  return createEthersanUrl(`/address/${address}?${params}`)
}
export function networkToTokenUrl(token: string, params?: string) {
  return createEthersanUrl(`/token/${token}?${params}`)
}

function createEthersanUrl(subPath: string) {
  return (networkId: Observable<string>) =>
    networkId.let(
      map(
        pipe(
          baseUrl => concat(baseUrl, subPath),
          createEtherscanBaseUrl,
          createNetworkPrefix
        )
      )
    );
}


export function idFromEvent({ transactionHash, transactionIndex, logIndex }: any) {
  return transactionHash + transactionIndex + logIndex
}