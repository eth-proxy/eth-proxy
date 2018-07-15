import { NumberLike, ObjKey } from '../../interfaces';

export interface RequestOptions {
  gas?: NumberLike;
  gasPrice?: NumberLike;
  value?: NumberLike;
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
> = T[C][M] extends { in: any }
  ? CreateRequestWithPayload<C, M, T[C][M]['in']>
  : CreateRequestWithoutPayload<C, M>;

export type RequestFactory<T extends {}> = {
  [C in Extract<keyof T, string>]: {
    [M in Extract<keyof T[C], string>]: CreateRequest<T, C, M>
  }
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

export interface ContractDefaults {
  from?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
}

export interface ProcessRequestArgs {
  abi;
  address;
  method;
  args;
  txParams;
}
