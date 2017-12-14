import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  TypeAliasDeclarationStructure
} from "ts-simple-ast";
import { chain, map, filter } from "ramda";

export type CreateEventDeclaraton = (
  e: EventDescription,
  json: TruffleJson
) => InterfaceDeclarationStructure[];

export const createEventInterfaces = (createFn: CreateEventDeclaraton) => (
  contracts: TruffleJson[]
) =>
  chain((json: TruffleJson) => {
    const eventAbis = json.abi.filter(a => a.type === "event") as EventDescription[];

    return chain(eventDescription => createFn(eventDescription, json), eventAbis);
  }, contracts);
