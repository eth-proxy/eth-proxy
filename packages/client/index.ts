import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Observable";
import { shareReplay } from "rxjs/operators/shareReplay";
import { take } from "rxjs/operators/take";
import { mergeMap } from "rxjs/operators/mergeMap";
import { createEpicMiddleware } from "redux-observable";

import { createObservableStore } from "./store";
import { createWeb3Instance } from "./utils";
import {
  getNetwork,
  getBalance,
  getLatestBlock,
  getDefaultAccount,
  getBlock,
  getEvents
} from "@eth-proxy/rx-web3";
import {
  createSetNetwork,
  getDetectedNetwork$,
  getContractFromRef,
  getActiveAccount,
  getUniqEvents$
} from "./store";
import {
  registerContract,
  RegisterContractOptions
} from "./modules/register-contract";
import { exec } from "./modules/exec";
import { rootEpic } from "./store/epics";
import { call } from "./modules/call";
import {
  TransactionWithHash,
  TruffleJson,
  ConfirmedTransaction,
  FailedTransaction,
  ContractInfo,
  EthProxyOptions,
  QueryModel,
  ContractRef,
  InterfaceRef
} from "./model";
import { first, mergeMapTo } from "rxjs/operators";
import "rxjs/add/Observable/timer";
import { query } from "./modules/query";
import { read, DataReader, ReadStrategy } from "./modules/read";
import * as Web3 from "web3";
import { curry, curryN } from "ramda";

export type Exec<T> = <CK extends keyof T>(
  nameOrAddress: ContractRef<CK>
) => <MK extends keyof T[CK]>(method: MK) => T[CK][MK];

export class EthProxy<T = {}> {
  registerContract: (abi, options: RegisterContractOptions) => void;

  exec: Exec<T>;
  call: <CK extends keyof T>(
    nameOrAddress: ContractRef<CK>
  ) => <MK extends keyof T[CK]>(method: MK) => T[CK][MK];

  // rxweb3
  getBalance: (account: string) => any;
  getLatestBlock: () => any;
  getBlock: (args) => any;

  provider$: Observable<Web3.Provider>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  getContractInfo: (nameOrAddress: string) => Observable<ContractInfo>;
  query: (queryModel: QueryModel) => Observable<any>;

  events$: Observable<any[]>;
  read: <T>(readDef: DataReader<T>, strategy?: ReadStrategy) => Observable<T>;
}

const defaultOptions = {
  pollInterval: 1000,
  eventReader: getEvents
};

export function createProxy<T>(
  provider$: Observable<any>,
  options: EthProxyOptions = defaultOptions
): EthProxy<T> {
  const replayProvider$ = provider$.pipe(shareReplay(1), take(1));
  const web3Proxy$ = replayProvider$.pipe(map(createWeb3Instance));

  web3Proxy$
    .pipe(mergeMap(getNetwork), map(createSetNetwork))
    .subscribe(action => store.dispatch(action));

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      web3Proxy$,
      options
    }
  });
  const store = createObservableStore(epicMiddleware);

  return {
    provider$: replayProvider$,
    registerContract: registerContract(store),

    exec: curryN(3, exec(store, web3Proxy$)) as any,
    call: curryN(3, call(store, web3Proxy$)) as any,
    query: query(store, web3Proxy$, options.eventReader),
    read: <T>(readDef: DataReader<T>, strategy?: ReadStrategy) =>
      web3Proxy$.pipe(mergeMap(web3 => read(store)(web3)(readDef, strategy))),

    network$: store.let(getDetectedNetwork$),
    defaultAccount$: store.select(getActiveAccount),

    getBalance: account => web3Proxy$.pipe(mergeMap(getBalance(account))),
    getLatestBlock: () => web3Proxy$.pipe(mergeMap(getLatestBlock)),
    getBlock: arg => web3Proxy$.pipe(mergeMap(getBlock(arg))),
    getContractInfo: (ref: ContractRef) =>
      store
        .select(getContractFromRef(ref))
        .pipe(first(x => !!x)),

    // To be removed
    events$: store.let(getUniqEvents$)
  };
}

export * from "./model";
export * from "./utils";
