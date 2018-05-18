#!/usr/bin/env node
import Ast, { SourceFileStructure } from 'ts-simple-ast';
import { concat, mergeDeepWith } from 'ramda';
import * as requireDir from 'require-dir';
import * as argv from 'minimist';
import * as path from 'path';
import { getSourceFile as getEthProxySourceFile } from './clients/eth-proxy';
import { getSourceFile as getTruffleSourceFile } from './clients/truffle';
import { getCommonSource } from './lib';
import { TruffleJson } from './interfaces';

const args = argv(process.argv.slice(2));

const contractsDir = path.join(
  process.cwd(),
  args['contractsDir'] || args['cDir']
);
const outputDir = path.join(process.cwd(), args['output'] || args['o']);
const target = args['target'] || args['t'] || 'eth-proxy';

const files = requireDir(contractsDir);
const contracts = Object.values(files) as TruffleJson[];
const generators = {
  'eth-proxy': getEthProxySourceFile,
  truffle: getTruffleSourceFile
};
const generator = generators[target];
const targetSource = generator(contracts);
const commonSource = getCommonSource(contracts);

const source = mergeDeepWith<SourceFileStructure, SourceFileStructure>(
  concat,
  commonSource,
  targetSource
);

const instertedText = {
  'eth-proxy': `declare module '@eth-proxy/client' {
  const C: RequestFactory<Contracts>;
  function entity <T>(model: EntityModel<T, EventsByType, Contracts>): EntityModel<T, EventsByType, Contracts>
}
`,
  truffle: ''
};

const sourceFile = new Ast()
  .createSourceFile(outputDir, source, {
    overwrite: true
  })
  .insertText(0, '/* tslint:disable */\n' + instertedText[target]);

sourceFile.save();
