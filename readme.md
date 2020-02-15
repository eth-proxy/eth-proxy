# eth-proxy is a toolset for integration with Ethereum blockchain. 

## What makes it different?

* It is tree-shakable which makes it UI dapps friendly.
* It has functional API
* It uses Promises and RxJS observables
* It is typesafe
* It is extendable via middlewares
* It is lazy

<br><br>

## [@eth-proxy/rpc](./packages/rpc) is like a Ramda for Ethereum [JSON RPC protocol](https://github.com/ethereum/wiki/wiki/json-rpc).

### It includes

[Methods](./packages/rpc/methods)<br>
It exports methods as a functions that accept arguments and return Promises. <br>

[Subscriptions](./packages/rpc/subscriptions)<br>
It wraps subscription in RxJS streams

[Middeware engine](./packages/rpc/middleware)<br>
It has build in middleware which makes it easy to extend and customize

[Middleware items](./packages/rpc/middleware/items)<br>
It comes with few common built in middlewares

[Utilities](./packages/rpc/utils)<br>
It also exports set of useful utility tools for hashing, units conversion etc

<br><br>

## [Codegen](./packages/codegen)  generates a typescript declarations from Ethereum solidity contracts ABI. 

### Available output types are
* Truffle library [Example](./packages/codegen/example/output/truffle/contracts.ts)
* @eth-proxy/client [Example](./packages/codegen/example/output/eth-proxy/contracts.ts)

<br><br>


## [Client](./packages/client) is build to make interaction with smart contracts simpler.

### How is it different
* Instead of generating classes, it accepts Contract Name and Method Name as an input. In case when contract has single instance, the address will be extracted from ABI so it can be ommited.
* It extends JSON rpc with custom methods like [getSchema](./packages/client/methods/get-schema.ts) so instead of passing JSON's around you can implement a single Contract Resolver with an interface ```(contractName: string) : Promise<ABI>```
It also makes loading contract ABI's lazy and reduces boilerplate.

### Example transaction

```
proxy.transaction({
  interface: 'ERC20',
  // When there is more then once instance of contract address is required, otherwise ContractResolver can provide address
  address: '0x...',
  method: 'approve',
  payload: {
     spender: 'x123',
     value: 12
  }
}).pipe(
  once('init', (transaction) => { console.log(' Transaction Initiated') }),
  on('confirmation', (confirmation) => { console.log(' Transaction confirmed ', confirmation ) }),
  catchError(error => console.log(error))
)
```

### Example call

```
ethCall(provider, {
  interface: 'AssetsRegistry',
  method: 'getAsset',
  payload: 'ZRX'
}).then(result => console.log(result)
```

### Example events query

```
{
   name: 'loans',
   deps: {
    MortgageContract: '*',
    RBAC: {
      RoleAdded: { user: '0x...' },
      RoleRemoved: { user: '0x...' }
    }
  }
}
```

### Request factories

If someone does not like the object options API, there is an alternative provided.
It might provide better typescript support depending on TS version, and it looks closer to the classes API.
Detailed explanation of how it works can be found [here](./packages/client#request-factory). 
It introduces a little bit of "magic" which might or might not be for your team.

```
const request = C.ZRXToken.approve({ spender: 'x123', value: 12 });
proxy.transaction(request);

ethCall(provider, C.RBAC.hasRole({user: '0x123', role: 'Admin' }))
```
