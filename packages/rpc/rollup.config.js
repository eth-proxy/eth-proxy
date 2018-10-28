import typescript from 'rollup-plugin-typescript2';
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
    'web3/lib/utils/utils',
    'web3/lib/web3/httpprovider',
    'crypto-js/sha3',
    'web3/lib/solidity/coder'
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
      typescript: require('typescript')
    })
  ]
};
