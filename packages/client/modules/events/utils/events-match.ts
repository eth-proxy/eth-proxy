import { BlockchainEvent } from '@eth-proxy/rpc';
import { isNil, isEmpty } from 'ramda';

import { NormalizedFilter } from '../model';

export function topicsMatches(filterTopics: string[][], eventTopic: string[]) {
  return filterTopics.every((topic, index) => {
    return isNil(topic) || isEmpty(topic) || topic.includes(eventTopic[index]);
  });
}

export function addressMatches<E extends { address: string }>(
  filter: NormalizedFilter,
  event: E
) {
  const addressess = Array.isArray(filter.address)
    ? filter.address
    : [filter.address];
  return addressess.includes(event.address);
}

export function blocksMatches(
  filter: NormalizedFilter,
  event: BlockchainEvent
) {
  return (
    event.blockNumber >= filter.fromBlock && event.blockNumber <= filter.toBlock
  );
}

export function isEventMatching(filter: NormalizedFilter) {
  return (event: BlockchainEvent) => {
    return (
      addressMatches(filter, event) &&
      blocksMatches(filter, event) &&
      topicsMatches(filter.topics, event.topics)
    );
  };
}
