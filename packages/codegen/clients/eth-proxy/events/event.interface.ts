import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  TypeAliasDeclarationStructure
} from 'ts-simple-ast';
import {
  solidityToJsOutputType,
  toEventPayloadName,
  toEventName,
  CreateEventDeclaraton
} from '../../../lib';

export const createEventInterface: CreateEventDeclaraton = (
  { name, inputs }: EventDescription,
  { contract_name }: TruffleJson
) => {
  return [
    {
      name: toEventPayloadName(contract_name, name),
      properties: inputs.map(({ name, type }) => ({
        name,
        type: solidityToJsOutputType(type)
      }))
    },
    {
      name: toEventName(contract_name, name),
      properties: [
        {
          name: 'type',
          type: `"${name}"`
        },
        {
          name: 'payload',
          type: toEventPayloadName(contract_name, name)
        },
        {
          name: 'meta',
          type: 'EventMetadata'
        }
      ]
    }
  ];
};
