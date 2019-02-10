import { sendTransaction } from './transaction';
import { createAppStore, ObservableStore, State } from '../store';
import * as actions from '../modules/transaction';
import * as fromRequest from '../modules/request';
import { AnyAction } from 'redux';
import { expect } from 'chai';
import { Observable } from 'rxjs';
import { testProvider } from '../../rpc/mocks';

const account = '123';

const interfaceName = 'Contract1';
const methodName = 'Method1';

const args = {
  a: 12
};

const id = '111';
const genId = () => id;

const txParams = {
  from: account
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
  let sendTx: (request: fromRequest.Request<any, any, any>) => Observable<any>;
  beforeEach(() => {
    store = createAppStore() as TestStore;
    const next = store.dispatch;
    store.dispatch = action => {
      store.dispatched = store.dispatched || [];
      store.dispatched.push(action);
      store.lastDispatched = action;
      const result = next(action);
      return result;
    };
    const provider = testProvider(() => [account]);
    sendTx = sendTransaction({ store, genId, options: {}, provider } as any);
  });

  it('Dispatches process action', done => {
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

  describe('Returns result', () => {
    let result$: Observable<any>;
    beforeEach(() => {
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
