import { watchLogs } from './logs';
import { marbles } from 'rxjs-marbles/mocha';
import {
  EthGetFilterChanges,
  EthUninstallFilterRequest,
  RawLog,
  Log
} from '../interfaces';
import { Subject } from 'rxjs';
import { omit } from 'ramda';
import { testProvider } from '../mocks';

const rawFilterArgs = {
  address: '123'
};

const logs = {
  a: { blockNumber: '0x0', data: 'log0' } as RawLog,
  b: { blockNumber: '0x1', data: 'log1' } as RawLog,
  c: { blockNumber: '0x2', data: 'log2' } as RawLog,
  d: { blockNumber: '0x3', data: 'log3' } as RawLog
};
const formattedLogs = {
  a: { blockNumber: 0, data: 'log0' } as Log,
  b: { blockNumber: 1, data: 'log1' } as Log,
  c: { blockNumber: 2, data: 'log2' } as Log,
  d: { blockNumber: 3, data: 'log3' } as Log
};

describe('logs watch', () => {
  it(
    'watches logs',
    marbles(m => {
      const filterId = '1';

      const requestsData = {
        n: {
          method: 'eth_newFilter',
          params: [rawFilterArgs]
        },
        l: {
          method: 'eth_getFilterLogs',
          params: [filterId]
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
      const logsByBlock = {
        0: [logs.a],
        1: [logs.b, logs.c],
        2: [],
        3: [logs.d]
      };
      let allLogs: RawLog[] = logsByBlock[0];

      // prettier-ignore
      const producer =     m.hot('-----1----23|', logsByBlock);
      // prettier-ignore
      const poll =         m.hot('p--p--p---pp--|');
      // prettier-ignore
      const requests =    m.cold('n-lc--c---cc--u', requestsData);
      // prettier-ignore
      const expected =    m.cold('--a---(bc)-d--|', formattedLogs);

      const server$ = new Subject();

      producer.subscribe(logs => {
        allLogs.push(...logs);
        let filter = filters[filterId];
        filter.push(...logs);
      });

      const provider = testProvider(payload => {
        server$.next(payload);
        if (Array.isArray(payload)) {
          throw Error('Should not be a batch');
        }
        switch (payload.method) {
          case 'eth_newFilter': {
            filters[filterId] = [];
            // todo: check if ok
            return m.cold('--r|', { r: filterId });
          }
          case 'eth_getFilterLogs': {
            return allLogs;
          }
          case 'eth_getFilterChanges': {
            const id = (payload as EthGetFilterChanges['request']).params[0];
            const changes = filters[id];
            filters[filterId] = [];

            return changes;
          }
          case 'eth_uninstallFilter': {
            const id = (payload as EthUninstallFilterRequest).params[0];
            filters = omit([id], filters);

            return true;
          }
        }
      });

      const result$ = watchLogs(provider, {
        timer$: poll,
        filter: rawFilterArgs
      });

      m.expect(server$).toBeObservable(requests);
      m.expect(result$).toBeObservable(expected);
    })
  );
});
