import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import { ObservableStore, State } from "../store";
import { send } from "./send";
import { map } from "rxjs/operators";
import { prop } from "ramda";

export const call = (
  store: ObservableStore<State>,
  web3Proxy$: Observable<Web3>
) => (nameOrAddress: string, method: string, args: any, tx_params: any) => {
  return send(store, web3Proxy$)(nameOrAddress, method, args, tx_params)
    .pipe(map(prop("data")))
    .toPromise();
};
