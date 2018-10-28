import { AbiDefinition } from '../interfaces';

interface Artifact {
  contractName: string;
  abi: AbiDefinition[];
  bytecode: string;
}

export const SampleToken: Artifact = {
  contractName: 'SampleToken',
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address'
        },
        {
          name: '_to',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_subtractedValue',
          type: 'uint256'
        }
      ],
      name: 'decreaseApproval',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_addedValue',
          type: 'uint256'
        }
      ],
      name: 'increaseApproval',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        },
        {
          name: '_spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    },
    {
      inputs: [
        {
          name: '_name',
          type: 'string'
        },
        {
          name: '_symbol',
          type: 'string'
        },
        {
          name: '_decimals',
          type: 'uint256'
        },
        {
          name: 'supply',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address'
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address'
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address'
        },
        {
          indexed: true,
          name: 'to',
          type: 'address'
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256'
        }
      ],
      name: 'Transfer',
      type: 'event'
    }
  ],
  bytecode:
    '0x60806040523480156200001157600080fd5b506040516200148a3803806200148a8339810180604052810190808051820192919060200180518201929190602001805190602001909291908051906020019092919050505083600390805190602001906200006f929190620000e4565b50826004908051906020019062000088929190620000e4565b508160058190555080600181905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050505062000193565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200012757805160ff191683800117855562000158565b8280016001018555821562000158579182015b82811115620001575782518255916020019190600101906200013a565b5b5090506200016791906200016b565b5090565b6200019091905b808211156200018c57600081600090555060010162000172565b5090565b90565b6112e780620001a36000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b4578063095ea7b31461014457806318160ddd146101a957806323b872dd146101d4578063313ce56714610259578063661884631461028457806370a08231146102e957806395d89b4114610340578063a9059cbb146103d0578063d73dd62314610435578063dd62ed3e1461049a575b600080fd5b3480156100c057600080fd5b506100c9610511565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101095780820151818401526020810190506100ee565b50505050905090810190601f1680156101365780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015057600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506105af565b604051808215151515815260200191505060405180910390f35b3480156101b557600080fd5b506101be6106a1565b6040518082815260200191505060405180910390f35b3480156101e057600080fd5b5061023f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106ab565b604051808215151515815260200191505060405180910390f35b34801561026557600080fd5b5061026e610a65565b6040518082815260200191505060405180910390f35b34801561029057600080fd5b506102cf600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610a6b565b604051808215151515815260200191505060405180910390f35b3480156102f557600080fd5b5061032a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610cfc565b6040518082815260200191505060405180910390f35b34801561034c57600080fd5b50610355610d44565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561039557808201518184015260208101905061037a565b50505050905090810190601f1680156103c25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103dc57600080fd5b5061041b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610de2565b604051808215151515815260200191505060405180910390f35b34801561044157600080fd5b50610480600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611001565b604051808215151515815260200191505060405180910390f35b3480156104a657600080fd5b506104fb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506111fd565b6040518082815260200191505060405180910390f35b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105a75780601f1061057c576101008083540402835291602001916105a7565b820191906000526020600020905b81548152906001019060200180831161058a57829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000600154905090565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515156106e857600080fd5b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561073557600080fd5b600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111515156107c057600080fd5b610811826000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461128490919063ffffffff16565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506108a4826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461129d90919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061097582600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461128490919063ffffffff16565b600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b60055481565b600080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080831115610b7c576000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610c10565b610b8f838261128490919063ffffffff16565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a3600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60048054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610dda5780601f10610daf57610100808354040283529160200191610dda565b820191906000526020600020905b815481529060010190602001808311610dbd57829003601f168201915b505050505081565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610e1f57600080fd5b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610e6c57600080fd5b610ebd826000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461128490919063ffffffff16565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610f50826000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461129d90919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b600061109282600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461129d90919063ffffffff16565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040518082815260200191505060405180910390a36001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600082821115151561129257fe5b818303905092915050565b60008082840190508381101515156112b157fe5b80915050929150505600a165627a7a72305820111665a11e1a31e30942720918c5aeb9b644bfe0114b23835cdd3bef6d698b860029'
};
