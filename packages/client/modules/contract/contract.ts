import { RequestOptions } from "./model";

// @ts-ignore
export interface Request<I extends string, M extends string, P, FR, TR>
  extends RequestOptions {
  interface: I;
  method: M;
  payload: P;
}

export class RequestHandlers<T> {
  ethCall: <I extends keyof T, M extends keyof T[I], P, FR, TR>(
    request: Request<I, M, P, FR, TR>
  ) => FR;
  transaction: <I extends keyof T, M extends keyof T[I], P, FR, TR>(
    request: Request<I, M, P, FR, TR>
  ) => TR;
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
export const C = new Proxy({}, interfaceProxy);
