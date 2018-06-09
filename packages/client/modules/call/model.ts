import { Request } from '../request';
import { Observable } from 'rxjs/Observable';
export type CallResult<T> = Observable<T>;

export type CallHandler<T> = <I extends keyof T, M extends keyof T[I]>(
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
) => CallResult<T[I][M] extends { out: infer Out } ? Out : never>;
