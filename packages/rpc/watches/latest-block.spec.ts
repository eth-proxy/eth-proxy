import { watchBlocks } from './latest-block';
import { marbles } from 'rxjs-marbles/mocha';
import {
  EthGetFilterChanges,
  EthNewBlockFilter,
  EthUninstallFilter,
  EthUninstallFilterRequest
} from '../interfaces';
import { Subject } from 'rxjs';
import { omit } from 'ramda';

describe('latest block watch', () => {
  it(
    'watches latest block',
    marbles(m => {
      const data = {
        a: '0x1',
        b: '0x2',
        c: '0x3',
        d: '0x4'
      };
      const filterId = '1';

      const requestsData = {
        i: {
          method: 'eth_newBlockFilter',
          params: []
        },
        c: {
          method: 'eth_getFilterChanges',
          params: [filterId]
        },
        u: {
          method: 'eth_uninstallFilter',
          params: [filterId]
        }
      };

      let filters = {};
      // prettier-ignore
      const producer =     m.hot('--a-b--cd|', data);
      // prettier-ignore
      const poll =        m.cold('-pp---p---p---|');
      // prettier-ignore
      const expected =    m.cold('--a---b---(cd)|', data);
      // prettier-ignore
      const requests =    m.cold('icc---c---c---u', requestsData);

      const server$ = new Subject();

      producer.subscribe(blocks => filters[filterId].push(blocks));

      const provider = {
        sendAsync: (payload, cb) => {
          server$.next(payload);
          if (Array.isArray(payload)) {
            return;
          }
          switch (payload.method) {
            case 'eth_newBlockFilter': {
              filters[filterId] = [];
              cb(null, { result: '1' } as EthNewBlockFilter['response']);
              return;
            }
            case 'eth_getFilterChanges': {
              const id = (payload as EthGetFilterChanges['request']).params[0];
              const changes = filters[id];
              filters[filterId] = [];

              cb(null, {
                result: changes
              } as EthGetFilterChanges['response']);
              return;
            }
            case 'eth_uninstallFilter': {
              const id = (payload as EthUninstallFilterRequest).params[0];
              filters = omit([id], filters);

              cb(null, {
                result: true
              } as EthUninstallFilter['response']);
              return;
            }
          }
        }
      };

      const result$ = watchBlocks(provider, {
        timer$: poll
      });

      m.expect(server$).toBeObservable(requests);
      m.expect(result$).toBeObservable(expected);
    })
  );
});
