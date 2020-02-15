# eth-proxy is a toolset for easy and typesafe integration with Ethereum blockchain. 
It is built with tree-shakibility in mind so its UI dapps friendly.


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


## [Codegen](./packages/codegen)  generates a typescript declarations from Ethereum solidity contracts ABI. 

### Available output types are
* Truffle library [Example](./packages/codegen/example/output/truffle/contracts.ts)
* @eth-proxy/client [Example](./packages/codegen/example/output/eth-proxy/contracts.ts)


## [Client](./packages/client) is build to make interaction with smart contracts simpler.

### How is it different
* Instead of generating classes, it accepts ContractName and MethodName as an input.
* It extends JSON rpc with custom methods like [getSchema](./packages/client/methods/get-schema.ts)

### Example transaction

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









