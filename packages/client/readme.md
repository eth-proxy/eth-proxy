# EthProxy Client

### Transactions

# Creation

EthProxy.transaction accepts request object.

Request object has following interface:

```
  interface Request {
    interface: I;
    method: M;
    payload: P;
    gas?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber
    value?: number | string | BigNumber
    from?: string;
    address?: string;
  }
```

Example of sending transaction would look like:

```
proxy.transaction({
  interface: 'ERC20',
  method: 'approve',
  payload: {
     spender: 'x123',
     value: 12
  }
})
```

Once request object is provided ethProxy will wait until it has contract with name matching interface property registered.
Interface, method and payload will be type changed with generated Aggregated Contracts Interface.

Despite the fact that this will be type checked, currently Typescript can only provide intellisense for interface property.
To Improve expirience of request creation, suggested approach would be to use Semantic Request Factory.

# Semantic Request Factory

Semantic Request Factory is object patched using ES6 proxy, that overwites js 'get' behavior.
First it takes contract name as property 'get' accessor,
If it where a native js object it would return undefined

```
const C = {}
C.ERC20 // undefined
```

But contract proxy instead is patched to store "ERC20" and return a method proxy.
import { C } from '@eth-proxy/client'
C.ERC20 // return object { interface: 'ERC20' } which is also patched, and awaits method name

Again if it would be native js it would fail
const C = {}
C.ERC20.approve // TypeError: Cannot read property 'approve' of undefined

But contract proxy is ready to take method name and its payload, to compose valid request object
import { C } from '@eth-proxy/client'
C.ERC20.approve({
spender: 'x123',
value: 12
}) // return request object { interface: 'ERC20' , method: 'approve', payload: { spender: 'x123', value: 12 }}

This is just a trick to avoid generating this code during compile time, and just of of many approaches for request creation.
It also can provide good readibility and IDE expirience, but KEEP IN MIND IF YOU TRY TO DO ANYTHING OTHER THEN RECOMMENDED HERE WITH THE PROXY, IT WONT BEHAVE AS YOU EXPECT.

There are two helper methods to help with common use cases of contract creation.

at - it will add address property to your proxy

const PPT = at(C.ERC20, '123sad213sd...');
PPT.approve({
spender: 'x123',
value: 12
})

withOptions - it allows to add additional options to request

const approve = C.ERC20.approve({
spender: 'x123',
value: 12
})
const approveWithGasLimit = withOptions(approve, { gas: 1000000 })

# Send transaction

To send transaction use transaction method on ethProxy
const approve = C.ERC20.approve({
spender: 'x123',
value: 12
})
ethProxy.transaction(approve)

# Result Stream

Transaction consists of multiple steps which can be recognized by status property.

Stages:

* Init - emmited after request is ready to be passed to the provider.

Request is ready when:

1. Contract needs to be registered
2. Account needs to be set

init event has following interface.

```
export interface TransactionInfo {
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: any;
  initId?: string;
}

interface InitializedTransaction extends TransactionInfo {
  status: "init";
}
```

Event has attached initId which is uniq identifier for this transaction, and will be attached to all transaction events.
It might be useful for optimistic ui updates.
Init event can be caputred using helper function "once".

```
import { once } from '@eth-proxy/client';
// proxy creation skipped
ethProxy.transaction(ERC20.approve({ })).pipe(
  once('init', (transaction) => { console.log(' Transaction Initiated ') })
)
```

* tx - emmited after transaction hash is generated.

tx event has following interface.

```
export interface TransactionWithHash extends TransactionInfo {
  tx: string;
  status: "tx";
}
```

Same as top example can be handled with once helper function.

```
import { once } from '@eth-proxy/client';
// proxy creation skipped
ethProxy.transaction(ERC20.approve({ })).pipe(
  once('tx', (txHash) => { console.log(' Transaction Hash generated ', txHash ) })
)
```

* confirmed - emmited when transaction receipt is loaded.

This is last event, it contains receipt and decoded logs.
Log decoder uses all reistered contracts ABI.

```
export interface ConfirmedTransaction extends TransactionInfo {
  tx: string;
  status: "confirmed";
  receipt: any;
  logs: any;
}
```

To handle this event and complete transaction stream, use 'on' helper

```
import { on } from '@eth-proxy/client';
// proxy creation skipped
ethProxy.transaction(ERC20.approve({ })).pipe(
  on('confirmation', (confirmation) => { console.log(' Transaction confirmed ', confirmation ) })
)
```
