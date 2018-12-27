import tsPlugin from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import pkg from './package.json';

export default {
  input: './index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'rxjs/operators',
    'crypto-js/sha3',
    'web3/lib/solidity/coder'
  ],
  plugins: [
    tsPlugin({
      tsconfig: 'tsconfig.build.json',
      typescript: ttypescript
    })
  ]
};
