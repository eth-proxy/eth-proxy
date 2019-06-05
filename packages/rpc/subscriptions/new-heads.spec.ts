import { subscribeNewHeads } from './new-heads';
import { testProvider, ofMethod } from '../mocks';
import { Block, RawBlock, NewHeadsParams } from '../interfaces';
import { assert } from 'chai';
import { of } from 'rxjs';

const options = { includeTransactions: true };
const subscriptionId = '1';

describe('New heads', () => {
  it('Subscribes to new heads', () => {
    const provider = testProvider(() => subscriptionId);
    subscribeNewHeads(provider, options).subscribe();

    const { params } = provider.getRequests().find(ofMethod('eth_subscribe'))!;

    assert.deepEqual(params as NewHeadsParams, ['newHeads', options]);
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

  it('Subscribes to new heads without options', () => {
    const provider = testProvider(() => subscriptionId);
    subscribeNewHeads(provider, {}).subscribe();

    const { params } = provider.getRequests().find(ofMethod('eth_subscribe'))!;

    assert.deepEqual(params as NewHeadsParams, ['newHeads']);
  });
});

const formattedBlock = {
  number: 6419658
} as Block;

const unformattedBlock = {
  number: '0x61f4ca'
} as RawBlock;
