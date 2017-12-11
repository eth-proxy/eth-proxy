import { pick } from "ramda";

const paramsKeys = ["from", "to", "gas", "gasPrice", "value"];
export const pickTxParamsProps = pick(paramsKeys);