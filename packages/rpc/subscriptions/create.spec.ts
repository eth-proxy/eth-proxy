import { marbles } from 'rxjs-marbles/mocha';
import { Subject, ReplaySubject } from 'rxjs';
import { testProvider } from '../mocks';
import { createSubscription } from './create';
import { takeUntil } from 'rxjs/operators';

const subscriptionTopic = 'subscriptionTopic';
const subscriptionArgs = { a: 12, b: 22 };

describe('Subscription creation', () => {
  it(
    'has correct flow',
    marbles(m => {
      const data = {
        a: '0x1',
        b: '0x2',
        c: '0x3',
        d: '0x4'
      };
      const subscriptionId = '1';

      const requestsPayloads = {
        s: {
          method: 'eth_subscribe',
          params: [subscriptionTopic, subscriptionArgs]
        },
        u: {
          method: 'eth_unsubscribe',
          params: [subscriptionId]
        }
      };

      // prettier-ignore
      const producer =     m.hot('--a---b--c|', data);
      // prettier-ignore
      const expected =    m.cold('--a---b|', data);
      // prettier-ignore
      const unsub$ =      m.cold('-------u|');
      // prettier-ignore
      const requests =    m.cold('s------u', requestsPayloads);

      const server$ = new Subject();

      const provider = testProvider(
        payload => {
          server$.next(payload);

          if (Array.isArray(payload)) {
            throw Error('Unknown method');
          }

          switch (payload.method) {
            case 'eth_subscribe': {
              return subscriptionId;
            }

            case 'eth_unsubscribe': {
              return true;
            }
            default:
              throw Error('Unknown method');
          }
        },
        {
          [subscriptionId]: producer
        }
      );

      const result$ = createSubscription(provider, {
        args: subscriptionArgs,
        type: subscriptionTopic as any
      }).pipe(takeUntil(unsub$));

      m.expect(server$).toBeObservable(requests);
      m.expect(result$).toBeObservable(expected);
    })
  );

  it(
    'Does not unsubscribe on connection error',
    marbles(m => {
      const subscriptionId = '1';

      // prettier-ignore
      const producer =     m.hot('-------#');
      // prettier-ignore
      const requests =    m.cold('s------|', {
        s: {
          method: 'eth_subscribe',
          params: [subscriptionTopic, subscriptionArgs]
        }
      });

      const server$ = new ReplaySubject();

      const provider = testProvider(
        payload => {
          server$.next(payload);

          if (Array.isArray(payload)) {
            throw Error('Unknown method');
          }

          switch (payload.method) {
            case 'eth_subscribe': {
              return subscriptionId;
            }

            case 'eth_unsubscribe': {
              return true;
            }

            default:
              throw Error('Unknown method');
          }
        },
        {
          [subscriptionId]: producer
        }
      );

      createSubscription(provider, {
        args: subscriptionArgs,
        type: subscriptionTopic as any
      }).subscribe({
        error: () => {
          server$.complete();
        }
      });

      m.expect(server$).toBeObservable(requests);
    })
  );
});
