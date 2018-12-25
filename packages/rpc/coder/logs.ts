import { toSignatureHash, isEventAbi, strip0x } from '../utils';
import {
  AbiDefinition,
  Log,
  DecodedEvent,
  EventDescription
} from '../interfaces';
import { Dictionary } from 'ramda';
import { decodeToObj } from './decoder';

/**
 * Find matching abi and decode logs with it
 * When abi is not found log is skipped
 */
export const decodeLogs = (abi: AbiDefinition[]) => {
  const events = eventsFromAbi(abi);

  return (logs: Log[]) => {
    return logs
      .filter(log => {
        const eventAbi = events[log.topics[0]];
        return !!eventAbi;
      })
      .map(log => {
        const eventAbi = events[log.topics[0]];
        return decodeLog(eventAbi, log);
      });
  };
};

function decodeLog(
  { anonymous, inputs, name: type }: EventDescription,
  log: Log
): DecodedEvent<any> {
  const argTopics = (anonymous ? log.topics : log.topics.slice(1)) || [];

  const indexedData = argTopics.map(topics => topics.slice(2)).join('');
  const indexedParams = decodeToObj(inputs.filter(i => i.indexed))(indexedData);

  const notIndexedData = strip0x(log.data || '');
  const notIndexedParams = decodeToObj(inputs.filter(i => !i.indexed))(
    notIndexedData
  );

  const params = {
    ...indexedParams,
    ...notIndexedParams
  };

  const payload = inputs.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: params[current.name]
    };
  }, {});

  return {
    type,
    payload,
    meta: {
      ...log,
      type
    }
  };
}

export function eventsFromAbi(
  abi: AbiDefinition[]
): Dictionary<EventDescription> {
  return abi.filter(isEventAbi).reduce((current, item) => {
    return {
      ...current,
      [toSignatureHash(item)]: item
    };
  }, {});
}
