import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getTransactionByTx,
  createTxGenerated,
  createTransactionFailed,
  getContractsFromNamesOrAddresses,
  getLatestBlockNumber,
  getLogDecoder,
  createQueryEventsSuccess,
  getFiltersNotQueriedForMany,
  createQueryEvents,
  getContractsFromQueryModel
} from "../store";
import {
  mergeMap,
  tap,
  map as rxMap,
  first,
  withLatestFrom,
  filter as rxFilter
} from "rxjs/operators";
import { send } from "./send";
import { Transaction, BlockRange, QueryModel } from "../model";
import {
  all,
  map,
  reduce,
  min,
  groupBy,
  forEachObjIndexed,
  mapObjIndexed,
  values,
  flatten,
  chain,
  propEq,
  filter,
  pipe,
  keys
} from "ramda";
import { getEvents } from "@eth-proxy/rx-web3";
import 'rxjs/add/Observable/forkJoin';

export const query = (
  store: ObservableStore<State>,
  web3Proxy$: Observable<Web3>,
  getEvents: (web3: Web3, filter: Web3.FilterObject) => Observable<any[]>
) => (queryModel: QueryModel): Observable<any> => {
  const contracts$ = store
    .select(getContractsFromQueryModel(queryModel))
    .pipe(first(all(x => !!x)));

  return contracts$.pipe(
    withLatestFrom(
      web3Proxy$,
      store.select(getLatestBlockNumber).let(rxFilter(x => !!x)),
      store.select(getLogDecoder),
      store.select(getFiltersNotQueriedForMany)
    ),
    mergeMap(([contracts, web3, toBlock, logDecoder, filterDone]) => {
      const addresses = map(c => c.address, contracts);
      const genesis = reduce<number, number>(
        min,
        Infinity,
        map(c => c.genesisBlock, contracts)
      );

      const omittedAlreadyDone = filterDone(
        addresses.map(address => ({
          address,
          range: [genesis, toBlock] as BlockRange
        }))
      );

      store.dispatch(
        createQueryEvents(
          chain(address => {
            return omittedAlreadyDone.map(range => ({
              address,
              range
            }));
          }, addresses)
        )
      );

      return Observable.forkJoin(
        omittedAlreadyDone.map(([fromBlock, toBlock]) =>
          getEvents(web3, {
            toBlock,
            fromBlock,
            address: addresses
          })
        )
      ).pipe(
        rxMap(flatten),
        rxMap(logDecoder),
        rxMap(events => [{ range: [genesis, toBlock], events }]),
        tap(([{ range, events }]) => {
          const results = addresses.map(address => ({
            address,
            events: filter(propEq("address", address), events),
            range
          }));
          store.dispatch(createQueryEventsSuccess(results));
        })
      );
    })
  );
};
