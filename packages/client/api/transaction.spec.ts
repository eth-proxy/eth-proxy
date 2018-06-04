import { sendTransaction } from './transaction';
import { createAppStore, ObservableStore, State } from '../store';
import * as actions from '../modules/transaction';
import * as fromAccount from '../modules/account';
import * as fromRequest from '../modules/request';
import { AnyAction } from 'redux';
import { expect } from 'chai';
import { Observable } from 'rxjs/Observable';
import { DEFAULT_GAS } from '../constants';

const account = '123';

const interfaceName = 'Contract1';
const methodName = 'Method1';

const args = {
  a: 12
};

const id = '111';
const genId = () => id;

const txParams = {
  from: account,
  gas: DEFAULT_GAS
};

const transactionData = {
  address: undefined,
  args,
  contractName: interfaceName,
  initId: id,
  method: methodName,
  txParams
};

type TestStore = ObservableStore<State> & {
  dispatched: AnyAction[];
  lastDispatched: AnyAction;
};

describe('Initialize transaction', () => {
  let store: TestStore;
  let sendTx: (request: fromRequest.Request<any, any, any>) => Observable<{}>;
  beforeEach(() => {
    store = createAppStore() as TestStore;
    let next = store.dispatch;
    store.dispatch = action => {
      store.dispatched = store.dispatched || [];
      store.dispatched.push(action);
      store.lastDispatched = action;
      let result = next(action);
      return result;
    };
    sendTx = sendTransaction({ store, genId, options: {} } as any);
  });

  it('Dispatches process action', done => {
    store.dispatch(fromAccount.createSetActiveAccount(account));

    sendTx({
      interface: interfaceName,
      method: methodName,
      payload: args
    }).subscribe(() => {
      const expectedAction = actions.createProcessTransaction(transactionData);

      expect(store.lastDispatched).to.deep.equal(expectedAction);
      done();
    });
  });

  describe('Controls the flow', () => {
    const expectedAction = actions.createProcessTransaction(transactionData);

    it('Waits for active account', done => {
      sendTx({
        interface: interfaceName,
        method: methodName,
        payload: args
      }).subscribe(() => {
        expect(store.lastDispatched).to.deep.equal(expectedAction);
        done();
      });
      store.dispatch(fromAccount.createSetActiveAccount(account));
    });
  });

  describe('Returns result', () => {
    let result$: Observable<any>;
    beforeEach(() => {
      store.dispatch(fromAccount.createSetActiveAccount(account));
      result$ = sendTx({
        interface: interfaceName,
        method: methodName,
        payload: args
      });
    });
    it('Emits init status', done => {
      result$.subscribe(result => {
        expect(result).to.deep.eq({
          address: undefined,
          args,
          contractName: interfaceName,
          method: methodName,
          initId: id,
          status: 'init',
          txParams
        });
        done();
      });
    });
  });
});
