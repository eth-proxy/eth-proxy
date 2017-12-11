import { expect } from "chai";
import { C, Request, methodProxy, at } from "./contract";
import { TransactionResult, EthProxy } from "../../model";

export type Events = any;
export type ContractsRequest<
  I extends string,
  M extends string,
  P,
  FR,
> = Request<I, M, P, FR, TransactionResult<Events>>;

interface Contract {
  method1(a: string): ContractsRequest<
    "Contract1",
    "method1",
    undefined,
    Promise<number>
  >;
  method2(a: string): ContractsRequest<
  "Contract1",
  "method1",
  string,
  Promise<number>
>;
}

interface Contract2 {
  method12(a: string, options?: any): ContractsRequest<
    "Contract1",
    "method1",
    string,
    Promise<number>
  >;
  method21(a: string, options?: any): ContractsRequest<
  "Contract1",
  "method1",
  string,
  Promise<number>
>;
}

interface Contracts {
  Contract1: Contract;
  Contract2: Contract2;
  
}

const { Contract1 } = C as Contracts;



describe("Create ", () => {
  it("Creates request object", () => {
    const request = Contract1.method1("213");
    
    expect(request).to.deep.eq({
      interface: "Contract1",
      method: "method1",
      payload: "213"
    });
  });

  it("At address", () => {
    const contractAt = at(Contract1, '5678')
    const request = contractAt.method1("12");

    expect(request).to.deep.eq({
      interface: "Contract1",
      method: "method1",
      payload: "12",
      address: '5678'
    });

  });
});
