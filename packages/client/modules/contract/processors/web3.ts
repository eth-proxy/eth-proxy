import { executeMethod } from "@eth-proxy/rx-web3";
import * as Web3 from "web3";

import { formatPayload } from "./payload";
import { getMethodAbi  } from "../../../utils";
import { ProcessRequestArgs} from "../../../store";

import { Observable } from 'rxjs/Observable'

export function createWeb3RequestProcessor(web3: Web3) {
  return ({ abi, address, method, args, txParams }: ProcessRequestArgs) => {
    const web3Method = web3.eth.contract(abi).at(address)[method];

    const methodAbi = getMethodAbi(abi, method);
    const web3Args = formatPayload(args, methodAbi)

    return executeMethod(web3Method, web3Args, txParams);
  };
}
