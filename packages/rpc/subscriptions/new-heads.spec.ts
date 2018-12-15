import { subscribeNewHeads } from './new-heads';
import { testProvider, ofMethod } from '../mocks';
import { NewHeadsOptions, RawLog, Block, RawBlock } from '../interfaces';
import { assert } from 'chai';
import { of } from 'rxjs';

const options: NewHeadsOptions = { includeTransactions: true };
const subscriptionId = '1';

describe('New heads', () => {
  it('Subscribes to new heads', () => {
    const provider = testProvider(() => subscriptionId);
    subscribeNewHeads(provider, options).subscribe();

    const { params } = provider.getRequests().find(ofMethod('eth_subscribe'));

    assert.deepEqual(params, ['newHeads', options]);
  });

  it('Returns parsed blocks', async () => {
    const provider = testProvider(() => subscriptionId, {
      [subscriptionId]: of(unformattedBlock)
    });

    const result = await subscribeNewHeads(provider, options)
      .pipe()
      .toPromise();

    assert.deepEqual(result, formattedBlock);
  });
});

const formattedBlock = {
  number: 6419658
} as Block;

const unformattedBlock = {
  number: '0x61f4ca'
} as RawBlock;
