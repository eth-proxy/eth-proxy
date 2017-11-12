export const imports = [
  {
    defaultImport: "BigNumber",
    moduleSpecifier: "bignumber.js"
  },
  {
    namedImports: [
      {
        name: "TransactionResult"
      },
      {
        name: "CallResult"
      }
    ],
    moduleSpecifier: "@eth-proxy/client"
  }
];
