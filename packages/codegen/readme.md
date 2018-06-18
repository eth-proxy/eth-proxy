# EthProxy codegen

Typescript code generator for EthProxy Client and Truffle-contract.
Transforms truffle contracts artifacts to type declarations.

### Install

```
npm install --save-dev @eth-proxy/codegen

OR

yarn add @eth-proxy/codegen --dev --exact
```

### Instructions

Provide path to folder with your contracts JSON artifacts and output where ganerated file should be stored.

If you are using truffle-contract, provide additional flag --target=truffle

Example output for EthProxy Client (./example/output/eth-proxy/contracts.ts)

Example output for truffle-contract (./example/output/truffle/contracts.ts)

Execute generation with

npx codegen {{ options - check API section }}

### Options

**Output - Required**

* Flag: --output
* Aliases: --o
* Default: NONE
* Expects: path where generated contracts should be saved, path should include file name and extension.

Example: --o=\"src/contracts.ts\"

**Contract Directory - Required**

* Flag: --contractsDir
* Aliases: --cDir
* Default: NONE
* Expects: path to folder with all truffle artifacts as json files.

Example: --cDir=\"../example/contracts\"

**Target**

* Flag: --target
* Aliases: --t
* Default: eth-proxy
* Options: eth-proxy, truffle
* Expects: target name, see supported targets in options.

Example: --t=truffle

# Example:

Truffle:

```
npx codegen --o=\"src/contracts.ts\" --cDir=\"build/contracts\" --t=truffle
```

Eth Proxy Client:

```
npx codegen --o=\"src/contracts.ts\" --cDir=\"build/contracts\"
```

# Development

## Generating example code

```
npm run gen:truffle
npm run gen:eth-proxy
```
