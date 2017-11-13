#!/usr/bin/env node
import Ast, {
  MethodSignatureStructure,
  ParameterDeclarationStructure,
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from "ts-simple-ast";
import { chain, map, toUpper, concat, pipe, flip, assoc, prop } from "ramda";
import {
  imports,
  getContractInterface,
  getInputInterfaces,
  getOutputInterfaces,
  transactionOptions,
  getRootInterface,
  getEventInterfaces,
  getEventTypeAliases,
  getContractsEventTypeAliases
} from "./lib";
import * as requireDir from "require-dir";
import * as glob from "glob";
import * as argv from "minimist";
import * as path from "path";

const args = argv(process.argv.slice(2));

const contractsDir = path.join(
  process.cwd(),
  args["contractsDir"] || args["cDir"]
);
const outputDir = path.join(process.cwd(), args["output"] || args["o"]);

const files = requireDir(contractsDir);
const contracts = Object.values(files);

const sourceFile = new Ast()
  .addSourceFileFromStructure(outputDir, {
    imports,
    interfaces: [
      getRootInterface(contracts),
      ...map(getContractInterface, contracts),
      ...chain(getInputInterfaces, contracts),
      ...chain(getOutputInterfaces, contracts),
      transactionOptions,
      ...chain(getEventInterfaces, contracts)
    ].map(assoc("isExported", true)),
    typeAliases: [
      ...map(getEventTypeAliases, contracts),
      getContractsEventTypeAliases(contracts)
    ].map(assoc("isExported", true))
  })
  .insertText(0, "/* tslint:disable */\n");

sourceFile.save();
