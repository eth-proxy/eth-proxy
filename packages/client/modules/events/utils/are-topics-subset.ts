import { isEmpty, length } from 'ramda';

const isTopicWildcard = isEmpty;

export function areTopicsSubset(
  fillerTopics: string[][],
  toFillTopics: string[][]
) {
  if (length(fillerTopics) !== length(toFillTopics)) {
    return false;
  }
  return toFillTopics.every((topic, index) => {
    const fillerTopic = fillerTopics[index];
    if (isTopicWildcard(topic)) {
      return isTopicWildcard(fillerTopic);
    }
    return topic.every(param => fillerTopic.includes(param));
  });
}
