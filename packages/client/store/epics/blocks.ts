import { ActionsObservable } from "redux-observable";
import { EpicContext } from "../model";
import { getLatestBlock } from "@eth-proxy/rx-web3";
import { createUpdateLatestBlock, UpdateLatestBlock } from "../actions/blocks";
import { map, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

export const watchLatestBlock = (
  _: ActionsObservable<any>,
  store,
  { web3Proxy$, options }: EpicContext
) => {
  return web3Proxy$.pipe(mergeMap(getLatestBlock), map(createUpdateLatestBlock));
};
