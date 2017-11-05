Motivation.

Eth proxy is higher abstraction for interaction with blockchain written to lower complexity of dapps. 
* It manages flow control so that developers dont run into raise conditions.
* It manages native ethereum entities, like blocks and transactions, to reduce boilerplate for something that most dapps needs.
* It allows developers to be more declarative in their code, and focus on domain entities not topics and hashes.

In order to iteract with blochain through metamask you need to:
- Hold your application bootsrapping until you get 'load' event, and then inject provider:
window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  startApp()
})
This is far from ideal, from MDN - "The load event is fired when a resource and its dependent resources have finished loading."
So we have delay in app bootstrapping and not very useful boilerplate code which evey app need to duplicate.

To solve this ethProxy factory takes an observable of provider, and manage it once it resolves, so we dont need to stop application bootstrap anymore, 

import { createProxy } from '@eth-proxy/client';
const provider$ = Observable.fromEvent(window, "load").map(() => window.web3.currentProvider);
const proxy = createProxy(provider$);

To reduce boilerplate there is a client for browser which does this for you.

import { browserProxyFactory } from '@eth-proxy/platform-browser';
const proxy = browserProxyFactory(options);

Lets compare interaction with contracts, and how truffle-contract does that.

--- bootstrap ----
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require("truffle-contract");
var MyContract = contract(truffleJSON);
MyContract.setProvider(provider);

--- usage ---

MyContract.deployed().then(function(instance) {
  var deployed = instance;
  return instance.someFunction(5);
}).then(function(result) {
  // Do something with the result or continue with more transactions.
});

Problems: 
- we need to pass provider to each contract we interact with
- when contract is triggering events on other contracts we have to do MyContract.link(instance) for each of those contracts
- we need to call deployed each time, or keep the contract instance stored as a variable
- we dont get transaction hash, which is critical for good user expirience
- when we want to read events we have 2 options: all contract events or single event

This is really causing a pain when app starts to grow, lets see how eth-proxy helps us solve those problems.

We already have an instance of a proxy, so we have to let it know about our contract. So lets register it:

proxy.registerContract(truffleJSON);

We have to do it only once and in truffle json there is alot of information that we can use. For example contract name, its methods and events.
So to execute the same logic as on example before we just have to do:

proxy.exec('MyContract', 'someFunction', { someArgument: 5 });

That looks quite different lets break it down, exec is a method on proxy that will execute transaction, it takes up to 4 argumens.
exec(
  contractName: string must equal contract name, 
  methodName: string must equal one of contract methods name, 
  arguments as an array or named : [] | {},
  options: gas etc..
)

This is quite different, we dont create any instance, we dont pass provider around and we drop other boilerplate like deployed, linking, and promise ressolve.
Instead we define what we want to execute, and the arguments, and thats exactly want we want. 

But there is another benefit not clearly visible at first. Lets say we have decomposed application, and one part does a transaction, and somewhere else contract is defined, it can easily cause raise condition causing exec to fail, since it does not have an contractJSON yet. No worries, eth-proxy easily handles that for you, it will wait until all preconditions are satisfied before executing. Same goes for calls and queries.

// Will work just fine
proxy.exec('MyContract', 'someFunction', { someArgument: 5 });
proxy.registerContract(truffleJSON);

// As well will work just fine. transaction will be executed after provider is delivered and contract registered
const proxy = createProxy(
  Observable.delay(5000)
  .do(() => proxy.registerContract(truffleJSON))
  .map(() => window.web3.currentProvider)
);
proxy.exec('MyContract', 'someFunction', { someArgument: 5 });

So we already got rid of managing contract instances, boilerplate is gone, as a bonus we also can provide arguments as a dictionary, 
Linking is dead, since we interact only with eth-proxy instance it will decode events for all contracts that are registered.

Truffle contract returns a promise, thats why it resolved only once, with full transaction result. Much better fit here it an Observable,
which can emit multiple times. There are also operators provided by eth-proxy to handle just this case. 
Full example of transaction would look like:

proxy.exec('MyContract', 'someFunction', { someArgument: 5 })
  .once('tx', (tx) => { toastr.info('tx generated!!', tx) })
  .on('confirmation', (confirmation) => { otherLogic(confirmation) })
  .error(
    (err) => {
      toastr.error('something went wrong');
      return Observable.of(err);
    }
  )

Reading events its also something that is really hard to do. We have to choose between single event or single contract.
Thats really bad. if we decide to do any filtering we will find this in documentation:

topics: Array of Strings - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null, e.g. [null, '0x00...']. You can also pass another array for each topic with options for that topic e.g. [null, ['option1', 'option2']]

This is really not want we want. We want to think in terms of entities no topics, thats why eth-proxy take an entity model and reurns events,
which are part of it. Here is an example:

const allItemsQuery: QueryModel = {
  name: 'allItems',
  deps: {
    Contract1 : {
      Event1: '*',
      Event2: {
        id: 12
      },
      Event3: {
        id: 12
      }
    },
    Contract2: {
      Event4: '*'
    },
    Contract3: '*',
  },
}

This is a query model, to search for events we have to do proxy.query(allItemsQuery), 
we will recive event stream of all events that are matching the query. 
Also thanks to event caching, if we execute it twice, only new mined blocks will be fetched, what we already fetched will be taken from memory.


API

Eth-proxy/client

createProxy(provider$: Observable<any>, options?: EthProxyOptions) => EthProxy;

