import { expect } from 'chai';

import { TransactionResult } from '../../model';
import { EthProxy } from '../../index';
import { pipe } from 'ramda';
import {
  ContractDefinition,
  ContractsAggregation,
  RequestFactory
} from './model';
import { C } from './contract-proxy';
import { at, withOptions } from './utils';

export type Events = any;

interface Contract {
  method1: {
    in: string;
    out: number;
    events: undefined;
  };
  method2: {
    in: string;
    out: number;
    events: undefined;
  };
}

interface Contract2 {
  method12: {
    in: string;
    out: number;
    events: undefined;
  };
  method21: {
    in: string;
    out: number;
    events: undefined;
  };
}

interface Contracts {
  Contract1: Contract;
  Contract2: Contract2;
}

const { Contract1, Contract2 } = C as RequestFactory<Contracts>;

describe('Create ', () => {
  it('Creates request object', () => {
    const request = Contract1.method1('213');

    expect(request).to.deep.eq({
      interface: 'Contract1',
      method: 'method1',
      payload: '213'
    });
  });

  it('At address', () => {
    const contractAt = at(Contract1, '5678');
    const request = contractAt.method1('12');

    expect(request).to.deep.eq({
      interface: 'Contract1',
      method: 'method1',
      payload: '12',
      address: '5678'
    });
  });

  it('With options', () => {
    const request = withOptions(Contract1.method1('12'), { gas: 12 });

    expect(request).to.deep.eq({
      interface: 'Contract1',
      method: 'method1',
      payload: '12',
      gas: 12
    });
  });
});
