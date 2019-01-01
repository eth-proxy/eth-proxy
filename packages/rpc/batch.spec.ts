import { getBalanceReq } from './methods';
import { assert } from 'chai';
import { batch } from './batch';
import { toString } from 'ramda';
import { testProvider } from './mocks';

const account1 = '0xc94770007dda54cF92009BFF0dE90c06F603a09f';
const account2 = '0x829bd824b016326a401d083b33d092293333a830';

const balanceAccount1 = '100';
const balanceAccount1Hex = '0x64';
const balanceAccount2 = '101';
const balanceAccount2Hex = '0x65';

describe('Batch', () => {
  it('Batches get balance requests', async () => {
    const provider = testProvider(args => {
      if (!Array.isArray(args)) {
        throw Error('Not a batch');
      }

      return args.map(({ params }) => {
        const account = params[0];

        if (account === account1) {
          return balanceAccount1Hex;
        }
        if (account === account2) {
          return balanceAccount2Hex;
        }
        throw Error('Unknown account');
      });
    });

    const result = await batch(provider, [
      getBalanceReq({ account: account1 }),
      getBalanceReq({ account: account2 })
    ]);

    assert.deepEqual(result.map(toString), [balanceAccount1, balanceAccount2]);
  });
});
