import { subscribeLogs } from './logs';
import { testProvider, ofMethod } from '../mocks';
import { LogFilter, RawLog } from '../interfaces';
import { assert } from 'chai';
import { of } from 'rxjs';

const logFilter: LogFilter = { address: ['123'], topics: [['123']] };
const subscriptionId = '1';

describe('Logs subscription', () => {
  it('Subscribes to logs', () => {
    const provider = testProvider(() => subscriptionId);
    subscribeLogs(provider, logFilter).subscribe();

    const { params } = provider.getRequests().find(ofMethod('eth_subscribe'))!;

    assert.deepEqual(params, ['logs', logFilter]);
  });

  it('Returns parsed logs', async () => {
    const provider = testProvider(() => subscriptionId, {
      [subscriptionId]: of({ blockNumber: '0x0', data: 'log0' })
    });

    const result = await subscribeLogs(provider, logFilter)
      .pipe()
      .toPromise();

    assert.deepEqual(result, { blockNumber: 0, data: 'log0' });
  });
});
