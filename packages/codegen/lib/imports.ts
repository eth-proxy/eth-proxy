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
      },
      {
        name: "EventMetadata"
      }
    ],
    moduleSpecifier: "@eth-proxy/client"
  }
];
