import * as Web3 from 'web3';
import * as ethJSABI from 'ethjs-abi';

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
        meta: log
      };
    });
};

function parseArg(type: string, value: any) {
  if (type.endsWith('[]')) {
    return value.map(item => parseArg(type.replace('[]', ''), item));
  }
  if (type.startsWith('uint') || type.startsWith('int')) {
    return new Web3().toBigNumber('0x' + value.toString(16));
  }
  return value;
}

export function eventsFromAbi(abi) {
  return abi.filter(item => item.type === 'event').reduce((current, item) => {
    const signature = eventAbiToSignature(item);

    return {
      ...current,
      [signature]: item
    };
  }, {});
}

export function eventAbiToSignature(item: any) {
  const args = item.inputs.map(x => x.type).join(',');

  return new Web3().sha3(`${item.name}(${args})`);
}

export function eventInputToSignature(item: any) {
  return new Web3().sha3(item);
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
