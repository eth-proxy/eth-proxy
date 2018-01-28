# Project Motivation.

Eth proxy is higher abstraction for interaction with blockchain written to lower complexity of dapps.

* It manages flow control so that developers dont run into raise conditions.
* It manages native ethereum entities, like blocks and transactions, to reduce boilerplate for something that most dapps needs.
* It allows developers to be more declarative in their code, and focus on domain entities not topics and hashes.
* It leverages rxjs observables to tackle highly asynchronius nature of blockchain interaction, and allow for multiple results from single request.

In order to iteract with blochain through lets say metamask you need to:

1. Hold your application bootsrapping until you get 'load' event, and then inject provider:

```
window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  startApp()
})
```

This is not ideal, from MDN - "The load event is fired when a resource and its dependent resources have finished loading."
So we have delay in app bootstrapping and not very useful boilerplate code which evey app need to duplicate.

To solve this ethProxy factory takes an observable of provider, and waits until it resolves, so we dont need to stop application bootstrap anymore.

```
import { createProxy } from '@eth-proxy/client';
const provider$ = Observable.fromEvent(window, "load").map(() => window.web3.currentProvider);
const proxy = createProxy(provider$);
```

To reduce boilerplate there is a client for browser which does this for you.

```
import { browserProxyFactory } from '@eth-proxy/platform-browser';
const proxy = browserProxyFactory(options);
```

Now, lets compare interaction with contracts, and how it is different frin truffle-contract.

Truffle-contract:

```
--- bootstrap ----
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require("truffle-contract");
var MyContract = contract(truffleJSON);
MyContract.setProvider(provider);

--- usage ---
MyContract.deployed().then(function(instance) {
  var deployed = instance;
  return instance.someFunction(5, 'text');
}).then(function(result) {
  // Do something with the result or continue with more transactions.
});
```

Problems:

* we need to pass provider to each contract we interact with
* when contract is triggering events on other contracts we have to do MyContract.link(instance) for each of those contracts
* we need to call deployed each time, or keep the contract instance stored as a variable
* we dont get transaction hash, which is critical for good user expirience
* when we want to get events we have 2 options: all contract events or single event
* JSON contract abstractions can get quite big, and you might need multiple of them. So it will also bloat your bundle.

This is really causing a pain when app starts to grow, lets see how eth-proxy helps us solve those problems.

To send a transaction or call with eth-proxy you need to prepare a request object, it has the following interface:

```
  interface Request {
    interface: string;
    method: string;
    payload: any;
    gas?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber
    value?: number | string | BigNumber
    from?: string;
    address?: string;
  }
```

Sample of sending same would looks like this:

```
ethProxy.transaction({
  interface: 'MyContract',
  method: 'someFunction',
  payload: {
    amount: 5,
    otherArgument: 'text'
  }
})
```

This transaction will be queued up, but there is one piece missing. We still need to provide contract JSON schema in order to be able to validate and execute this request.

Instead of passing json schema to each contract instance, eth-proxy accepts contractSchemaResolver as part of configuration.
Schema resolver is just a function with following interface:

```
type ContractSchemaResolver = (
  args: { name: string }
) => SubscribableOrPromise<ResolvedContractSchema>;
```

Once contract is necessary to fulfill the request, eth-proxy will call this function.
If you are using truffle, you probably have a folder with json files. Here is how resolver could look like:

```
const appContractSchemaResolver = ({ name }) => import(`assets/contracts/${name}.json`);
```

Keep it mind this is example for typescript with module target esnext, depending on your build process and folder structure it might look sligtly different but the idea is the same, lazy load schemas once they are required.

As you notices primary difference is that we dont create any contract instances and we dont need to do any asynchronious action before calling the contract. We can do this transaction request before web3 is injected, network is detected, and it will be queued up and resolved when all preconditions are met. If some of preconditions wont be met transaction will fail. Same behaviour is applied to calls and queries.

Sending transaction is one thing, but also we need to observe its state and act accordingly.

Truffle contract returns a promise, thats why it resolved only once, with full transaction result. Much better fit here it an Observable,
which can emit multiple times. There are also operators provided by eth-proxy to handle just this case.
Full example of transaction would look like:

```
const request = {
  interface: 'MyContract',
  method: 'someFunction',
  payload: {
    amount: 5,
    otherArgument: 'text'
  }
}
ethProxy.transaction(request)
.once('tx', (tx) => { toastr.info('tx generated!', tx) })
.on('confirmation', (confirmation) => { otherLogic(confirmation) })
.error(
// handle error
)
```

Reading events its also something that is really hard to do. We have to choose between single event or single contract.
Thats really bad. if we decide to do any filtering we will find this in documentation:

topics: Array of Strings - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]

This is really not want we want. We want to think in terms of entities no topics, thats why eth-proxy take an entity model and reurns events,
which are part of it. Here is an example:

```
const allItemsQuery: QueryModel = {
name: 'allItems',
deps: {
Contract1 : {
Event1: '_',
Event2: {
id: 12
},
Event3: {
id: 12
}
},
Contract2: {
Event4: '_'
},
Contract3: '\*',
},
}
```

This is a query model, to search for events we have to do proxy.query(allItemsQuery),
we will recive event stream of all events that are matching the query.
Also thanks to event caching, if we execute it twice, only new mined blocks will be fetched, what we already fetched will be taken from memory.
