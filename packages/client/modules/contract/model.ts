import { CallResult, TransactionResult } from '../../model';
import { curry, CurriedFunction2 } from 'ramda';
import { BigNumber } from 'bignumber.js';

export interface RequestOptions {
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  value?: number | string | BigNumber;
  from?: string;
  address?: string;
}

export interface RequestWithoutPayload<I extends string, M extends string>
  extends RequestOptions {
  interface: I;
  method: M;
}

export interface Request<I extends string, M extends string, P>
  extends RequestOptions {
  interface: I;
  method: M;
  payload: P;
}

export type ObjHas<Obj extends {}, K extends string> = ({
  [K in keyof Obj]: '1'
} & {
  [k: string]: '0';
})[K];

export type CreateRequestWithPayload<C extends string, M extends string, P> = (
  payload: P
) => Request<C, M, P>;

export type CreateRequestWithoutPayload<
  C extends string,
  M extends string
> = () => Request<C, M, never>;

export type CreateRequest<
  T extends ContractsAggregation<any>,
  C extends string,
  M extends string
> = {
  1: CreateRequestWithPayload<C, M, T[C][M]['in']>;
  0: CreateRequestWithoutPayload<C, M>;
}[ObjHas<T[C][M], 'in'>];

export type RequestFactory<T extends {}> = {
  [C in keyof T]: { [M in keyof T[C]]: CreateRequest<T, C, M> }
};

export type ContractDefinition<T> = {
  [M in keyof T]: {
    in?: any;
    out: any;
    events: any;
  }
};

export type ContractsAggregation<T extends {}> = {
  [I in keyof T]: ContractDefinition<T[I]>
};

export class RequestHandlers<T extends {}> {
  ethCall: <I extends keyof T, M extends keyof T[I]>(
    request: Request<I, M, T[I][M]['in']>
  ) => CallResult<T[I][M]['out']>;

  transaction: <I extends keyof T, M extends keyof T[I], V extends T[I][M]>(
    request: Request<I, M, T[I][M]['in']>
  ) => TransactionResult<T[I][M]['events']>;
}
