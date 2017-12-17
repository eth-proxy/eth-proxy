declare module 'web3' {
  import BigNumber from 'bignumber.js';
  type Callback<T> = (err: Error | null, value: T) => void;

  class Web3 {
    public static providers: typeof providers;

    public version: {
      network: string;
      getNetwork(callback: Callback<string>): void;
      getNode(callback: Callback<string>): void;
    };

    public eth: {
      estimateGas: any;
      getGasPrice: any;
      accounts: string[];
      coinbase: string;
      defaultAccount: string;
      blockNumber: number;
      sign(
        address: string,
        message: string,
        callback: Callback<string>
      ): string;
      getBlock(
        blockHash: string | number,
        callback: Callback<Web3.Block>
      ): BigNumber;
      getBlockNumber(callback: Callback<number>): void;
      contract<A>(abi: Web3.ContractAbi): Web3.Contract<A>;
      getBalance(
        addressHexString: string,
        callback?: Callback<BigNumber>
      ): BigNumber;
      getCode(addressHexString: string, callback?: Callback<string>): string;
      filter(value: string | Web3.FilterObject): Web3.FilterResult;
      getAccounts(callback: Callback<string[]>): string[];
      sendTransaction(txData: any, callback: Callback<any>): void;
      getTransactionReceipt(txHash: string, callback: Callback<any>): void;
      getTransactionCount(
        addressHexString: string,
        defaultBlock: number | string,
        callback: Callback<number>
      ): number;
      getTransactionCount(
        addressHexString: string,
        callback: Callback<number>
      ): number;
    };

    public setProvider(provider: Web3.Provider): void;
    public currentProvider: Web3.Provider;
    public fromWei(amount: number | BigNumber, unit: string): BigNumber;
    public toWei(amount: number | BigNumber, unit: string): BigNumber;
    public isAddress(address: string): boolean;
    toBigNumber(number: string | number | BigNumber): BigNumber;
    sha3(text: string): string;
  }

  namespace providers {
    class HttpProvider implements Web3.Provider {
      sendAsync: any;
      constructor(url?: string | null);
    }
  }

  namespace Web3 {
    type ContractAbi = Array<AbiDefinition>;

    type AbiDefinition = FunctionDescription | EventDescription;

    interface FunctionDescription {
      type: 'function' | 'constructor' | 'fallback';
      name?: string;
      inputs: Array<FunctionParameter>;
      outputs?: Array<FunctionParameter>;
      constant?: boolean;
      payable?: boolean;
    }

    interface EventParameter {
      name: string;
      type: string;
      indexed: boolean;
    }

    interface EventDescription {
      type: 'event';
      name: string;
      inputs: Array<EventParameter>;
      anonymous: boolean;
    }

    interface FunctionParameter {
      name: string;
      type: string;
    }

    interface Contract<A> {
      at(address: string): A;
      new: any;
    }

    interface FilterObject {
      fromBlock?: number | string;
      toBlock?: number | string;
      address?: string | string[];
      topics?: string[];
    }

    interface SolidityEvent<A> {
      event: string;
      address: string;
      args: A;
    }

    interface FilterResult {
      get<T>(callback: Callback<SolidityEvent<T>[]>): void;
      watch<T>(callback: Callback<SolidityEvent<T>[]>): void;
      stopWatching(callback: Callback<true>): void;
    }

    interface Block {
      author: string;
      difficulty: BigNumber;
      extraData: string;
      gasLimit: number;
      gasUsed: number;
      hash: string;
      logsBloom: string;
      miner: string;
      number: number;
      parentHash: string;
      receiptsRoot: string;
      sealFields: string[];
      sha3Uncles: string;
      signature: string;
      size: number;
      stateRoot: string;
      step: string;
      timestamp: number;
      totalDifficulty: BigNumber;
      transactions: string[];
      transactionsRoot: string;
      uncles: string[];
    }

    interface Provider {
      sendAsync: any;
    }
  }
  /* tslint:disable */
  export = Web3;
  /* tslint:enable */
}
