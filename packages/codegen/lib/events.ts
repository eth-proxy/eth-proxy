import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  TypeAliasDeclarationStructure
} from "ts-simple-ast";
import {
  toEventPayloadName,
  getProperty,
  toEventName,
  solidityToJsStrictType,
  toContractEventsName
} from "./utils";
import { chain, map, filter } from "ramda";

export function getEventInterfaces({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const eventAbis = abi.filter(a => a.type === "event") as EventDescription[];

  return chain(({ name, inputs }): InterfaceDeclarationStructure[] => {
    return [
      {
        name: toEventPayloadName(contract_name, name),
        properties: inputs.map(({ name, type }) => ({
          name,
          type: solidityToJsStrictType(type)
        }))
      },
      {
        name: toEventName(contract_name, name),
        properties: [
          {
            name: "type",
            type: `"${name}"`
          },
          {
            name: "payload",
            type: toEventPayloadName(contract_name, name)
          },
          {
            name: "meta",
            type: "EventMetadata"
          }
        ]
      }
    ];
  }, eventAbis);
}

export function getEventTypeAliases({
  contract_name,
  abi
}: TruffleJson): TypeAliasDeclarationStructure {
  const eventAbis = abi.filter(a => a.type === "event") as EventDescription[];

  const contractEvents = map(({ name }) => toEventName(contract_name, name), eventAbis);
  const eventsUnion = contractEvents.join(" | ");

  return {
    name: toContractEventsName(contract_name)(""),
    type: eventsUnion
  };
}

export function getContractsEventTypeAliases(
  jsons: TruffleJson[]
): TypeAliasDeclarationStructure {
  const contractsEvents = map(
    ({ contract_name }) => toContractEventsName(contract_name)(""),
    jsons
  );
  const contractsEventsUnion = contractsEvents.join(" | ");

  return {
    name: "ContractsEvents",
    type: contractsEventsUnion
  };
}
