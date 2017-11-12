import { InterfaceDeclarationStructure } from "ts-simple-ast";

export const transactionOptions: InterfaceDeclarationStructure = {
  name: "TransactionOptions",
  properties: [
    {
      name: "from",
      type: "string",
      hasQuestionToken: true
    },
    {
      name: "value",
      type: "number | string | BigNumber",
      hasQuestionToken: true
    },
    {
      name: "gas",
      type: "number | string | BigNumber",
      hasQuestionToken: true
    },
    {
      name: "gasPrice",
      type: "number | string | BigNumber",
      hasQuestionToken: true
    }
  ]
};
