import {
  solidityToJsOutputType,
  toEventPayloadName,
  toEventName,
  CreateEventDeclaraton
} from '../../lib';
import { TruffleJson } from '../../interfaces';
import { EventDescription } from '@eth-proxy/rpc';

export const createEventInterface: CreateEventDeclaraton = (
  { name, inputs }: EventDescription,
  { contractName }: TruffleJson
) => {
  return [
    {
      name: toEventPayloadName(contractName, name),
      properties: inputs.map(({ name: inputName, type }) => ({
        name: inputName,
        type: solidityToJsOutputType(type)
      }))
    },
    {
      name: toEventName(contractName, name),
      properties: [
        {
          name: 'type',
          type: `"${name}"`
        },
        {
          name: 'payload',
          type: toEventPayloadName(contractName, name)
        },
        {
          name: 'meta',
          type: 'EventMetadata'
        }
      ]
    }
  ];
};
