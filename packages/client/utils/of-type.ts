import { OperatorFunction } from 'rxjs';
import { Action } from 'redux';
import { filter } from 'rxjs/operators';

export function ofType<
  V extends Extract<U, { type: T1 }>,
  T1 extends string = string,
  U extends Action = Action
>(t1: T1): OperatorFunction<U, V>;
export function ofType<
  V extends Extract<U, { type: T1 | T2 }>,
  T1 extends string = string,
  T2 extends string = string,
  U extends Action = Action
>(t1: T1, t2: T2): OperatorFunction<U, V>;
export function ofType<V extends Action>(
  ...allowedTypes: string[]
): OperatorFunction<Action, V>;

export function ofType(
  ...allowedTypes: string[]
): OperatorFunction<Action, Action> {
  return filter((action: Action) =>
    allowedTypes.some(type => type === action.type)
  );
}
