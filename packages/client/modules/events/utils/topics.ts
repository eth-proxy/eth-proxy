import { Topics, ContractQuery } from '../model';
import {
  groupWith,
  equals,
  reduce,
  uniq,
  pipe,
  omit,
  mergeDeepWith,
  concat,
  dropLastWhile
} from 'ramda';

export function groupByTopic(topics: Topics[]) {
  return groupWith((t1: Topics, t2: Topics) => {
    return equals(omit(['eventTopic'], t1), omit(['eventTopic'], t2));
  }, topics);
}

const emptyTopics: Topics = {
  eventTopic: [],
  t1: [],
  t2: [],
  t3: []
};

export function mergeTopics(groupedTopics: Topics[]): Topics {
  return reduce(
    mergeDeepWith(
      pipe(
        concat,
        uniq as any
      )
    ),
    emptyTopics,
    groupedTopics
  );
}

export function toTopicList(topic: Topics) {
  return dropLastWhile(equals([]), [
    topic.eventTopic,
    topic.t1,
    topic.t2,
    topic.t3
  ]);
}

export function splitQueryByTopics({ address, range, topics }: ContractQuery) {
  const groupedTopics = groupByTopic(topics).map(mergeTopics);

  return groupedTopics.map(topics => ({
    address,
    range,
    topics
  }));
}
