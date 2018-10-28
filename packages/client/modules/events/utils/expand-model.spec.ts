import { depsToTopics } from './expand-model';
import { expect } from 'chai';
import { AbiDefinition } from '@eth-proxy/rpc';

const transferTopic =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

const tokenAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  } as AbiDefinition
];

const account = '0x78a4b1857eff7346f3676d9d028ff321d14accbf';
const accountTopic =
  '0x00000000000000000000000078a4b1857eff7346f3676d9d028ff321d14accbf';

const account2 = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
const account2Topic =
  '0x0000000000000000000000000xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';

describe('Expand user model', () => {
  it('expands wildcards', () => {
    expect(depsToTopics(tokenAbi, '*')).to.deep.eq([
      {
        eventTopic: [transferTopic],
        t1: [],
        t2: [],
        t3: []
      }
    ]);
  });

  it('preserves single filters', () => {
    expect(
      depsToTopics(tokenAbi, {
        Transfer: {
          from: account
        }
      })
    ).to.deep.eq([
      {
        eventTopic: [transferTopic],
        t1: [accountTopic],
        t2: [],
        t3: []
      }
    ]);
  });

  it('splits OR filters', () => {
    expect(
      depsToTopics(tokenAbi, {
        Transfer: [
          {
            from: account
          },
          {
            to: account
          }
        ]
      })
    ).to.deep.eq([
      {
        eventTopic: [transferTopic],
        t1: [accountTopic],
        t2: [],
        t3: []
      },
      {
        eventTopic: [transferTopic],
        t1: [],
        t2: [accountTopic],
        t3: []
      }
    ]);
  });
});
