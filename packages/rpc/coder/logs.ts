import { toSignatureHash, isEventAbi, strip0x } from '../utils';
import { AbiDefinition, Log } from '../interfaces';
import { Dictionary } from 'ramda';
import { EventDescription } from '../interfaces';
import { BigNumber } from 'bignumber.js';
import { decodeParams } from './decoder';
import { zipObj, pipe } from 'ramda';

export const decodeLogs = (abi: AbiDefinition[]) => {
  const events = eventsFromAbi(abi);

  return (logs: Log[]) => {
    return logs
      .filter(log => {
        const eventAbi = events[log.topics[0]];
        return !!eventAbi;
      })
      .map(log => {
        const { anonymous, inputs, name: type } = events[log.topics[0]];

        const argTopics = (anonymous ? log.topics : log.topics.slice(1)) || [];

        const indexedData = argTopics.map(topics => topics.slice(2)).join('');
        const indexedParams = decodeToObj(inputs.filter(i => i.indexed))(
          indexedData
        );

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
            [current.name]: parseArg(current.type, params[current.name])
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
      });
  };
};

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

function decodeToObj<T extends { type: string; name: string }>(
  deinitions: T[]
) {
  return pipe(
    decodeParams(deinitions.map(x => x.type)),
    zipObj(deinitions.map(x => x.name))
  );
}
