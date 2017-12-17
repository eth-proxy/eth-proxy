import { processTransaction } from "./process";
import {
  createObservableStore,
  ObservableStore,
  State,
  DEFAULT_GAS
} from "client/store";
import * as actions from "client/store/actions";
import { NetworkDefinition } from "client/model";
import { AnyAction } from "redux";
import { expect } from "chai";
import { Observable } from "rxjs/Observable";

const account = "123";

const interfaceName = "Contract1";
const methodName = "Method1";
const address = "678";
const networkId = "test";
const abi = [
  {
    type: "function",
    name: methodName,
    inputs: []
  } as FunctionDescription
];
const contractJSON = {
  contract_name: interfaceName,
  abi,
  unlinked_binary: "",
  networks: {
    [networkId]: {
      address
    } as NetworkDefinition
  }
};
const args = {
  a: 12
};

const id = "111";
const genId = () => id;

const txParams = {
  from: account,
  gas: DEFAULT_GAS
};

const transactionData = {
  abi: contractJSON.abi,
  address,
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

describe("Initialize transaction", () => {
  let store: TestStore;
  beforeEach(() => {
    store = createObservableStore() as TestStore;
    let next = store.dispatch;
    store.dispatch = action => {
      store.dispatched = store.dispatched || [];
      store.dispatched.push(action);
      store.lastDispatched = action;
      let result = next(action);
      return result;
    };
  });

  it("Dispatches process action", () => {
    store.dispatch(actions.createSetActiveAccount(account));
    store.dispatch(
      actions.createRegisterContract(contractJSON, {
        address
      } as any)
    );

    processTransaction(store, genId)({
      interface: interfaceName,
      method: methodName,
      payload: args
    }).subscribe();

    const expectedAction = actions.createProcessTransaction(transactionData);

    expect(store.lastDispatched).to.deep.equal(expectedAction);
  });

  describe("Controls the flow", () => {
    const expectedAction = actions.createProcessTransaction(transactionData);

    it("Waits for contract to be registered", () => {
      store.dispatch(actions.createSetActiveAccount(account));

      processTransaction(store, genId)({
        interface: interfaceName,
        method: methodName,
        payload: args
      }).subscribe();

      store.dispatch(
        actions.createRegisterContract(contractJSON, {
          address
        } as any)
      );

      expect(store.lastDispatched).to.deep.equal(expectedAction);
    });

    it("Waits for active account", () => {
      store.dispatch(
        actions.createRegisterContract(contractJSON, {
          address
        } as any)
      );

      processTransaction(store, genId)({
        interface: interfaceName,
        method: methodName,
        payload: args
      }).subscribe();

      store.dispatch(actions.createSetActiveAccount(account));
      expect(store.lastDispatched).to.deep.equal(expectedAction);
    });
  });

  describe("Reports result", () => {
    let result$: Observable<any>;
    beforeEach(() => {
      store.dispatch(
        actions.createRegisterContract(contractJSON, {
          address
        } as any)
      );

      store.dispatch(actions.createSetActiveAccount(account));
      result$ = processTransaction(store, genId)({
        interface: interfaceName,
        method: methodName,
        payload: args
      });
    });
    it("Emits init status", () => {
      let result;
      result$.subscribe(x => {
        result = x
      });
      
      expect(result).to.deep.eq({
        address,
        args,
        contractName: interfaceName,
        method: methodName,
        initId: id,
        status: 'init',
        txParams
      })
    });
  });

});
