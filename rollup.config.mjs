import { createRequire } from 'module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      preferBuiltins: false,
    }),
    // Add the postcss plugin before typescript
    postcss({
      extensions: ['.css'],
      minimize: true,
      inject: true, // Injects the CSS into the bundle
      // If you want to extract CSS to separate files instead, use:
      // extract: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
   }),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      presets: ['@babel/preset-react', '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),
    terser(),
  ],
  external: ['react', 'react-dom', '@babel/runtime']
};