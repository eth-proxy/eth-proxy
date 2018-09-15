import * as ethJSABI from 'ethjs-abi';
import { BigNumber } from 'bignumber.js';
import { toSignatureHash } from '@eth-proxy/rx-web3';

export const decodeLogs = abi => (logs: any[]) => {
  const events = eventsFromAbi(abi);

  return logs
    .filter(log => {
      const eventAbi = events[log.topics[0]];
      return !!eventAbi;
    })
    .map(log => {
      const eventAbi = events[log.topics[0]];

      var argTopics = eventAbi.anonymous ? log.topics : log.topics.slice(1);

      var indexedData =
        '0x' + argTopics.map(topics => topics.slice(2)).join('');
      var indexedParams = ethJSABI.decodeEvent(
        partialABI(eventAbi, true),
        indexedData
      );

      var notIndexedData = log.data;
      var notIndexedParams = ethJSABI.decodeEvent(
        partialABI(eventAbi, false),
        notIndexedData
      );
      const params = {
        ...indexedParams,
        ...notIndexedParams
      };

      const payload = eventAbi.inputs.reduce((acc, current) => {
        return {
          ...acc,
          [current.name]: parseArg(current.type, params[current.name])
        };
      }, {});

      return {
        type: eventAbi.name,
        payload,
        meta: {
          ...log,
          type: eventAbi.name
        }
      };
    });
};

function parseArg(type: string, value: any) {
  if (type.endsWith('[]')) {
    return value.map(item => parseArg(type.replace('[]', ''), item));
  }
  if (type.startsWith('uint') || type.startsWith('int')) {
    return new BigNumber('0x' + value.toString(16));
  }
  return value;
}

export function eventsFromAbi(abi) {
  return abi.filter(item => item.type === 'event').reduce((current, item) => {
    return {
      ...current,
      [toSignatureHash(item)]: item
    };
  }, {});
}

function partialABI(fullABI, indexed) {
  var inputs = fullABI.inputs.filter(i => i.indexed === indexed);

  return {
    inputs,
    name: fullABI.name,
    type: fullABI.type,
    anonymous: fullABI.anonymous
  };
}
