import { RpcRequest, Provider } from '../interfaces';
import { EMPTY, isObservable, Observable } from 'rxjs';
import { SynchronousPromise } from 'synchronous-promise';
import { Dictionary } from 'ramda';

type FakeResult = (payload: RpcRequest | RpcRequest[]) => any;
const requestIdentity = (payload: RpcRequest | RpcRequest[]) => payload;

export function testProvider(
  mapper: FakeResult = requestIdentity,
  observers: Dictionary<Observable<any>> = {}
) {
  const payloads: RpcRequest[] = [];

  const helpers = {
    getRequests: () => payloads,
    getOnlyRequest: () => {
      if (payloads.length === 0) {
        throw Error('No requests were sent');
      }
      if (payloads.length > 1) {
        throw Error('More requests were sent, use getRequests to get them all');
      }
      return payloads[0];
    }
  };

  return {
    send: payload => {
      payloads.push(payload as RpcRequest);
      return new SynchronousPromise(res => {
        const result = mapper(payload);

        if (isObservable(result)) {
          result.subscribe(next => res({ result: next }));
          return;
        }

        res({ result });
      }) as Promise<any>;
    },
    observe: id => observers[id] || EMPTY,
    disconnect: () => {},
    ...helpers
  } as Provider & typeof helpers;
}

export function ofMethod(method: RpcRequest['method']) {
  return (x: RpcRequest) => x.method === method;
}
