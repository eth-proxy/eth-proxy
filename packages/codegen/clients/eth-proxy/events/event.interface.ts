import {
  solidityToJsOutputType,
  toEventPayloadName,
  toEventName,
  CreateEventDeclaraton
} from '../../../lib';
import { EventDescription, TruffleJson } from '../../../interfaces';

export const createEventInterface: CreateEventDeclaraton = (
  { name, inputs }: EventDescription,
  { contractName }: TruffleJson
) => {
  return [
    {
      name: toEventPayloadName(contractName, name),
      properties: inputs.map(({ name, type }) => ({
        name,
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
