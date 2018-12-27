import {
  solidityToJsOutputType,
  toEventPayloadName,
  toEventName,
  CreateEventDeclaraton
} from '../../../lib';
import { TruffleJson } from '../../../interfaces';
import { EventDescription } from '@eth-proxy/rpc';

export const createEventDeclaration: CreateEventDeclaraton = (
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
          name: 'event',
          type: `"${name}"`
        },
        {
          name: 'args',
          type: toEventPayloadName(contractName, name)
        }
      ],
      extends: ['EventMetadata']
    }
  ];
};
