import { Observable } from "rxjs/Observable";
import { map, tap, mergeMap } from "rxjs/operators";
import {
  createTxGenerated,
  getTransactionByTx,
  ObservableStore,
  State
} from "../../store";
import { prop, identity } from "ramda";

export const callAdapter = (
  source: Observable<{ address; from; method; data }>
) => {
  return source.let(map(prop("data")));
};

export interface CreateExecAdapterContext {
  store: ObservableStore<State>,
  userAdapter?: (source: Observable<any>) => Observable<any>
}

export interface SendResult { 
  address: string; 
  args: any; 
  method: string; 
  data: any;
  contractName: string;
  txParams: any;
}

export const createExecAdapter = ({
  store,
  userAdapter = map(identity)
}) => (
  source: Observable<SendResult>
) => {
  return source.pipe(
    map(res => ({ ...res, tx: res.data })),
    tap(result => store.dispatch(createTxGenerated(result))),
    mergeMap(({ tx }) => store.select(getTransactionByTx(tx))),
    userAdapter
  );
};
