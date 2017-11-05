import * as Web3 from "web3";
import * as ethJSABI from "ethjs-abi";

export const decodeLogs = abi => logs => {
  const events = eventsFromAbi(abi);

  return logs
    .filter(log => {
      const logABI = events[log.topics[0]];

      if (!logABI) {
        return;
      }

      return !!logABI;
    })
    .map(log => {
      const logABI = events[log.topics[0]];

      var copy = { ...log };

      var argTopics = logABI.anonymous ? copy.topics : copy.topics.slice(1);
      var indexedData =
        "0x" + argTopics.map(topics => topics.slice(2)).join("");

      var indexedParams = ethJSABI.decodeEvent(
        partialABI(logABI, true),
        indexedData
      );

      var notIndexedData = copy.data;
      var notIndexedParams = ethJSABI.decodeEvent(
        partialABI(logABI, false),
        notIndexedData
      );

      copy.event = logABI.name;

      copy.args = logABI.inputs.reduce((acc, current) => {
        var val = indexedParams[current.name];

        if (val === undefined) {
          val = notIndexedParams[current.name];
        }

        acc[current.name] = val;
        return acc;
      }, {});

      Object.keys(copy.args).forEach(key => {
        var val = copy.args[key];

        // We have BN. Convert it to BigNumber
        if (val.constructor.isBN) {
          copy.args[key] = new Web3().toBigNumber("0x" + val.toString(16));
        }
      });

      delete copy.data;
      delete copy.topics;

      return copy;
    });
};

export function eventsFromAbi(abi) {
  return abi.filter(item => item.type === "event").reduce((current, item) => {
    const signature = eventAbiToSignature(item);

    return {
      ...current,
      [signature]: item
    };
  }, {});
}

export function eventAbiToSignature(item: any) {
  const args = item.inputs.map(x => x.type).join(",");

  return new Web3().sha3(`${item.name}(${args})`);
}

export function eventInputToSignature(item: any) {
  return new Web3().sha3(item);
}

function partialABI(fullABI, indexed) {
  var inputs = fullABI.inputs.filter(i => i.indexed === indexed);

  return {
    inputs: inputs,
    name: fullABI.name,
    type: fullABI.type,
    anonymous: fullABI.anonymous
  };
}
