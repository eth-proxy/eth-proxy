import { zipObj, chain } from 'ramda';
import * as Web3 from 'web3';
import { eventAbiToSignature } from '../../schema';
import { Topics } from '../model';

const arrify = (value: any | any[]) => (Array.isArray(value) ? value : [value]);

const formatInput = (type: string) => (value: any) => {
  if (type === 'address') {
    return '0x' + value.substr(2).padStart(64, '0');
  } else {
    throw Error('Not supported filter type ' + type);
  }
};

const TOPICS = ['t1', 't2', 't3'];

export const expandArgumentTopics = (
  { inputs }: Web3.AbiDefinition,
  filter: {}
): {} => {
  const indexedArgs = (inputs as Web3.EventParameter[]).filter(
    arg => arg.indexed
  );

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

export function depsToTopics(abi: Web3.AbiDefinition[], contractDeps: {}) {
  const isWildcardContract = contractDeps === '*';
  const allEvents = abi.filter(x => x.type === 'event');

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
        eventTopic: [eventAbiToSignature(eventDefinition)],
        ...expandArgumentTopics(eventDefinition, filter)
      };
    });
  }, events) as Topics[];
}
