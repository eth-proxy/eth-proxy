import { RequestOptions } from "./model";
import { CallResult, TransactionResult } from "../../model";
import { curry, CurriedFunction2 } from "ramda";

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
  [K in keyof Obj]: "1"
} & {
  [k: string]: "0";
})[K];

export type CreateRequestWithPayload<C extends string, M extends string, P> = (
  payload: P
) => Request<C, M, P>;

export type CreateRequestWithoutPayload<C extends string, M extends string> = () => Request<C, M, never>;

export type CreateRequest<
  T extends ContractsAggregation,
  C extends string,
  M extends string
> = {
  1: CreateRequestWithPayload<C, M, T[C][M]["in"]>;
  0: CreateRequestWithoutPayload<C, M>;
}[ObjHas<T[C][M], "in">];

export type RequestFactory<T extends ContractsAggregation> = {
  [C in keyof T]: { [M in keyof T[C]]: CreateRequest<T, C, M> }
};

export interface ContractDefinition {
  [method: string]: {
    in?: any;
    out: any;
    events: any;
  };
}

export interface ContractsAggregation {
  [interfaceName: string]: ContractDefinition;
}

export class RequestHandlers<T extends ContractsAggregation> {
  ethCall: <I extends keyof T, M extends keyof T[I]>(
    request: Request<I, M, T[I][M]["in"]>
  ) => CallResult<T[I][M]["out"]>;

  transaction: <I extends keyof T, M extends keyof T[I], V extends T[I][M]>(
    request: Request<I, M, T[I][M]["in"]>
  ) => TransactionResult<T[I][M]["events"]>;
}

export interface Request<I extends string, M extends string, P>
  extends RequestOptions {
  interface: I;
  method: M;
  payload: P;
}

export const methodProxy = {
  get: (target, name) => {
    return payload => ({
      ...target,
      payload,
      method: name
    });
  }
};
export const interfaceProxy = {
  get: (target, name) => {
    return new Proxy(
      {
        ...target,
        interface: name
      },
      methodProxy
    );
  }
};

export function at<T extends {}>(contractProxy: T, address: string): T {
  const current = Object.assign({ address }, (contractProxy as any).fake());
  return new Proxy(current, methodProxy);
}
export const withOptions = <T extends {}>(
  request: T,
  options: RequestOptions
): T => {
  return Object.assign({}, request, options);
};

export const C = new Proxy({}, interfaceProxy);
