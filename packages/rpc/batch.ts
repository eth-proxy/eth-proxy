import { Provider } from './interfaces';
import { RequestDef, send } from './utils';

type Results<T extends RequestDef<any, any>[]> = {
  [P in keyof T]: T[P] extends RequestDef<any, any>
    ? ReturnType<T[P]['parseResult']>
    : never
};

type MethodReturn<R extends RequestDef<any, any>> = ReturnType<
  R['parseResult']
>;
export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>,
  R3 extends RequestDef<any, any>,
  R4 extends RequestDef<any, any>,
  R5 extends RequestDef<any, any>,
  R6 extends RequestDef<any, any>,
  R7 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2, R3, R5, R6, R7]
): Promise<
  [
    MethodReturn<R>,
    MethodReturn<R1>,
    MethodReturn<R2>,
    MethodReturn<R3>,
    MethodReturn<R4>,
    MethodReturn<R5>,
    MethodReturn<R6>,
    MethodReturn<R7>
  ]
>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>,
  R3 extends RequestDef<any, any>,
  R4 extends RequestDef<any, any>,
  R5 extends RequestDef<any, any>,
  R6 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2, R3, R5, R6]
): Promise<
  [
    MethodReturn<R>,
    MethodReturn<R1>,
    MethodReturn<R2>,
    MethodReturn<R3>,
    MethodReturn<R4>,
    MethodReturn<R5>,
    MethodReturn<R6>
  ]
>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>,
  R3 extends RequestDef<any, any>,
  R4 extends RequestDef<any, any>,
  R5 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2, R3, R5]
): Promise<
  [
    MethodReturn<R>,
    MethodReturn<R1>,
    MethodReturn<R2>,
    MethodReturn<R3>,
    MethodReturn<R4>,
    MethodReturn<R5>
  ]
>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>,
  R3 extends RequestDef<any, any>,
  R4 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2, R3]
): Promise<
  [
    MethodReturn<R>,
    MethodReturn<R1>,
    MethodReturn<R2>,
    MethodReturn<R3>,
    MethodReturn<R4>
  ]
>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>,
  R3 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2, R3]
): Promise<
  [MethodReturn<R>, MethodReturn<R1>, MethodReturn<R2>, MethodReturn<R3>]
>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>,
  R2 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1, R2]
): Promise<[MethodReturn<R>, MethodReturn<R1>, MethodReturn<R2>]>;

export function batch<
  R extends RequestDef<any, any>,
  R1 extends RequestDef<any, any>
>(
  provider: Provider,
  defs: [R, R1]
): Promise<[MethodReturn<R>, MethodReturn<R1>]>;

export function batch<R extends RequestDef<any, any>>(
  provider: Provider,
  defs: [R]
): Promise<[MethodReturn<R>]>;

export function batch<R extends RequestDef<any, any>>(
  provider: Provider,
  defs: R[]
): Promise<MethodReturn<R>[]>;

export function batch<R extends RequestDef<any, any>[]>(
  provider: Provider,
  defs: R
) {
  return send(provider)(defs.map(x => x.payload)).then(results => {
    return defs.map((x, i) => x.parseResult(results[i]));
  }) as Promise<Results<R>>;
}
