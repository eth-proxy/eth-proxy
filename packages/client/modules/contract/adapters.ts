import { Observable } from "rxjs/Observable";
import { map, tap, mergeMap } from "rxjs/operators";
import {
  createTxGenerated,
  getTransactionByTx,
  ObservableStore,
  State
} from "../../store";
import { prop } from "ramda";

export const createCallAdapter = ({ userInterceptor }) => (
  source: Observable<{ address; from; method; data }>
) => {
  return source.pipe(map(prop("data")), userInterceptor);
};

export interface CreateExecAdapterContext {
  store: ObservableStore<State>;
  userInterceptor: (source: Observable<any>) => Observable<any>;
}

export interface SendResult {
  address: string;
  args: any;
  method: string;
  data: any;
  contractName: string;
  txParams: any;
}

export const createExecAdapter = ({ store, userInterceptor }) => (
  source: Observable<SendResult>
) => {
  return source.pipe(
    map(res => ({
      ...res,
      tx: res.data
    })),
    tap(result => store.dispatch(createTxGenerated(result))),
    mergeMap(({ tx }) => store.select(getTransactionByTx(tx))),
    tap((result: any) => {
      if (result.status === "failed") {
        throw Error(result.error);
      }
    }),
    userInterceptor
  );
};
