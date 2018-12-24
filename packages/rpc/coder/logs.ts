import { toSignatureHash, isEventAbi, strip0x } from '../utils';
import { AbiDefinition, Log } from '../interfaces';
import { Dictionary } from 'ramda';
import { EventDescription } from '../interfaces';
import { BigNumber } from 'bignumber.js';
import { decodeParams } from './decoder';
import { zipObj } from 'ramda';

export const decodeLogs = (abi: AbiDefinition[]) => {
  const events = eventsFromAbi(abi);

  return (logs: Log[]) => {
    return logs
      .filter(log => {
        const eventAbi = events[log.topics[0]];
        return !!eventAbi;
      })
      .map(log => {
        const { anonymous, inputs, name } = events[log.topics[0]];

        const argTopics = (anonymous ? log.topics : log.topics.slice(1)) || [];

        const indexed = inputs.filter(i => i.indexed);
        const indexedData = argTopics.map(topics => topics.slice(2)).join('');
        const indexedValues = decodeParams(
          indexed.map(x => x.type),
          indexedData
        );
        const indexedParams = zipObj(indexed.map(x => x.name), indexedValues);

        const notIndexed = inputs.filter(i => !i.indexed);
        const notIndexedData = strip0x(log.data || '');
        const notIndexedValues = decodeParams(
          notIndexed.map(x => x.type),
          notIndexedData
        );
        const notIndexedParams = zipObj(
          notIndexed.map(x => x.name),
          notIndexedValues
        );

        const params = {
          ...indexedParams,
          ...notIndexedParams
        };

        const payload = inputs.reduce((acc, current) => {
          return {
            ...acc,
            [current.name]: parseArg(current.type, params[current.name])
          };
        }, {});

        return {
          type: name,
          payload,
          meta: {
            ...log,
            type: name
          }
        };
      });
  };
};

// Memoize
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

function parseArg(type: string, value: any) {
  if (type.endsWith('[]')) {
    return value.map(item => parseArg(type.replace('[]', ''), item));
  }
  if (type.startsWith('uint') || type.startsWith('int')) {
    return new BigNumber('0x' + value.toString(16));
  }
  return value;
}
