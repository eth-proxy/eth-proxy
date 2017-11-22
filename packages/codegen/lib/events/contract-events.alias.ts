import { TypeAliasDeclarationStructure } from "ts-simple-ast";
import { map } from "ramda";
import { toEventName, toContractEventsName } from "../utils";

export const getContractEventsAliases = map(getContractEventAlias)

export function getContractEventAlias({
  contract_name,
  abi
}: TruffleJson): TypeAliasDeclarationStructure {
  const eventAbis = abi.filter(a => a.type === "event") as EventDescription[];

  const contractEvents = map(({ name }) => toEventName(contract_name, name), eventAbis);
  const eventsUnion = contractEvents.join(" | ");

  return {
    name: toContractEventsName(contract_name)(""),
    type: eventsUnion || "never"
  };
}

