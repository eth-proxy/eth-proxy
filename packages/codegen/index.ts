#!/usr/bin/env node
import Ast, {
  MethodSignatureStructure,
  ParameterDeclarationStructure,
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from "ts-simple-ast";
import * as sample from "../sample.json";
import { chain, map, toUpper, concat, pipe, flip } from "ramda";
import {
  imports,
  getContractInterface,
  getInputInterfaces,
  getOutputInterfaces,
  transactionOptions,
  getRootInterface
} from "./lib";
import * as requireDir from 'require-dir';
import * as glob from 'glob';
import * as argv from 'minimist';

const args = argv(process.argv.slice(2));

const contractsDir = args['contractsDir'] || args['cDir'];
const outputDir = args['output'] || args['o'];

const files = requireDir(contractsDir);

const ast = new Ast();

const contracts = Object.values(files);
export const contract = (sample as any) as TruffleJson;

const sourceFile = ast.addSourceFileFromStructure(outputDir, {
  interfaces: [
    getRootInterface(contracts),
    ...contracts.map(getContractInterface),
    ...chain(getInputInterfaces, contracts),
    ...chain(getOutputInterfaces, contracts),
    transactionOptions
  ],
  imports
});

sourceFile.save();
