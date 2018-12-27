import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { chain } from 'ramda';
import { TruffleJson } from '../../interfaces';
import { EventDescription, isEventAbi } from '@eth-proxy/rpc';

export type CreateEventDeclaraton = (
  e: EventDescription,
  json: TruffleJson
) => InterfaceDeclarationStructure[];

export const createEventInterfaces = (createFn: CreateEventDeclaraton) => (
  contracts: TruffleJson[]
) =>
  chain((json: TruffleJson) => {
    const eventAbis = json.abi.filter(isEventAbi);

    return chain(
      eventDescription => createFn(eventDescription, json),
      eventAbis
    );
  }, contracts);
