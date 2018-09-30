import { zipObj, chain } from 'ramda';
import { Topics } from '../model';
import {
  toSignatureHash,
  AbiDefinition,
  isEventAbi,
  EventDescription,
  EventParameter
} from '@eth-proxy/rx-web3';
import { arrify } from '@eth-proxy/rx-web3';

const formatInput = (type: string) => (value: any) => {
  if (type === 'address') {
    return '0x' + value.substr(2).padStart(64, '0');
  } else {
    throw Error('Not supported filter type ' + type);
  }
};

const TOPICS = ['t1', 't2', 't3'];

export const expandArgumentTopics = (
  { inputs }: EventDescription,
  filter: {}
): {} => {
  const indexedArgs = (inputs as EventParameter[]).filter(arg => arg.indexed);

  const topicValues = TOPICS.map((_, index) => {
    const arg = indexedArgs[index];
    if (!arg) {
      return [];
    }
    return filter[arg.name]
      ? arrify(filter[arg.name]).map(formatInput(arg.type))
      : [];
  });

  return zipObj(TOPICS, topicValues) as any;
};

export function depsToTopics(abi: AbiDefinition[], contractDeps: {}) {
  const isWildcardContract = contractDeps === '*';
  const allEvents = abi.filter(isEventAbi);

  const events = allEvents.filter(
    e => isWildcardContract || !!contractDeps[e.name]
  );

  return chain(eventDefinition => {
    const { name } = eventDefinition;
    const isWildcardEvent = isWildcardContract || contractDeps[name] === '*';
    const eventDeps: any[] = Array.isArray(contractDeps[name])
      ? contractDeps[name]
      : [isWildcardEvent ? {} : contractDeps[name]];

    return eventDeps.map(filter => {
      return {
        eventTopic: [toSignatureHash(eventDefinition)],
        ...expandArgumentTopics(eventDefinition, filter)
      };
    });
  }, events) as Topics[];
}
