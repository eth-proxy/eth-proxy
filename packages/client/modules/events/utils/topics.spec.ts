import { BlockRange, Topics } from '../model';
import { expect } from 'chai';
import {
  groupByTopic,
  mergeTopics,
  splitQueryByTopics,
  toTopicList
} from './topics';

const range = [0, 0] as BlockRange;
const address = '123';

const createTopic = (override: Partial<Topics>): Topics => ({
  eventTopic: [],
  t1: [],
  t2: [],
  t3: [],
  ...override
});

describe('groupByTopic', () => {
  it('groups events when filter is the same', () => {
    expect(
      groupByTopic([
        createTopic({
          eventTopic: ['event1'],
          t1: ['12']
        }),
        createTopic({
          eventTopic: ['event2'],
          t1: ['12']
        })
      ])
    ).to.deep.eq([
      [
        createTopic({
          eventTopic: ['event1'],
          t1: ['12']
        }),
        createTopic({
          eventTopic: ['event2'],
          t1: ['12']
        })
      ]
    ]);
  });

  it('separates events when filter is subset of other filter', () => {
    expect(
      groupByTopic([
        createTopic({
          eventTopic: ['event1'],
          t1: ['12'],
          t2: ['13']
        }),
        createTopic({
          eventTopic: ['event2'],
          t1: ['12']
        })
      ])
    ).to.deep.eq([
      [
        createTopic({
          eventTopic: ['event1'],
          t1: ['12'],
          t2: ['13']
        })
      ],
      [
        createTopic({
          eventTopic: ['event2'],
          t1: ['12']
        })
      ]
    ]);
  });
});

describe('mergeTopics', () => {
  it('merges events', () => {
    expect(
      mergeTopics([
        createTopic({
          eventTopic: ['event1']
        }),
        createTopic({
          eventTopic: ['event2']
        })
      ])
    ).to.deep.eq(
      createTopic({
        eventTopic: ['event1', 'event2']
      })
    );
  });

  it('merges filters', () => {
    const topics = [
      createTopic({
        t1: ['1'],
        t2: ['1']
      }),
      createTopic({
        t1: ['1'],
        t2: ['2']
      })
    ];
    expect(mergeTopics(topics)).to.deep.eq(
      createTopic({
        t1: ['1'],
        t2: ['1', '2']
      })
    );
  });
});

describe('toTopicList', () => {
  it('converts topics to ethereum topic query', () => {
    expect(
      toTopicList({
        eventTopic: ['topic1'],
        t1: ['t1'],
        t2: ['t2'],
        t3: ['t3']
      })
    ).to.deep.eq([['topic1'], ['t1'], ['t2'], ['t3']]);
  });

  it('drops last empty topics', () => {
    expect(
      toTopicList({
        eventTopic: ['topic1'],
        t1: ['12'],
        t2: [],
        t3: []
      })
    ).to.deep.eq([['topic1'], ['12']]);
  });

  it('keeps the order of topics', () => {
    expect(
      toTopicList({
        eventTopic: ['topic1'],
        t1: [],
        t2: ['12'],
        t3: []
      })
    ).to.deep.eq([['topic1'], [], ['12']]);
  });
});

describe('splitQueryByTopics', () => {
  it('splits request when filter is different', () => {
    expect(
      splitQueryByTopics({
        range,
        address,
        topics: [
          createTopic({
            eventTopic: ['event1'],
            t1: ['12']
          }),
          createTopic({ eventTopic: ['event2'] })
        ]
      })
    ).to.deep.eq([
      {
        address,
        range,
        topics: createTopic({
          eventTopic: ['event1'],
          t1: ['12']
        })
      },
      {
        address,
        range,
        topics: createTopic({ eventTopic: ['event2'] })
      }
    ]);
  });
});
