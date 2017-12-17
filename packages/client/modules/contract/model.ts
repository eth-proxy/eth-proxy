import { BigNumber } from "bignumber.js";

export interface RequestOptions {
  from?: string;
  gas?: string | BigNumber | number;
  gasPrice?: string | BigNumber | number;
  value?: string | BigNumber | number;
}

export interface RequestSpec<I extends string, M extends string, P>
  extends RequestOptions {
  interface: I;
  method: M;
  address?: string;
  payload: P;
}
