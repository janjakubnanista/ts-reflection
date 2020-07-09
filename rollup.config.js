import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';

const defaults = {
  external: ['child_process', 'path', 'typescript'],
  plugins: [
    resolve({ preferBuiltins: true }),
    ts(),
    copy({
      targets: [{ src: ['package.json', 'LICENSE', 'README.md'], dest: './dist' }],
    }),
  ],
};

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    ...defaults,
  },
  {
    input: './src/transformer/index.ts',
    output: {
      file: './dist/transformer.js',
      format: 'cjs',
    },
    ...defaults,
  },
  {
    input: './src/runtime/index.ts',
    output: {
      file: './dist/runtime.js',
      format: 'cjs',
    },
    ...defaults,
  },
];
