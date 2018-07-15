import { Request } from '../request';
import { Observable } from 'rxjs';
export type CallResult<T> = Observable<T>;

export type CallHandler<T> = <
  I extends Extract<keyof T, string>,
  M extends Extract<keyof T[I], string>
>(
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
) => CallResult<T[I][M] extends { out: infer Out } ? Out : never>;
