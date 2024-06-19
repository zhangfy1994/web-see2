/* eslint-disable no-undef */
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的文件名
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块的目录名
const __dirname = dirname(__filename);

const packagesDir = path.resolve(__dirname, 'packages');
const packageFiles = fs.readdirSync(packagesDir);
function output(path) {
  return [
    {
      input: [`./packages/${path}/src/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs.js`,
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.esm.js`,
          format: 'esm',
          sourcemap: true,
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: 'umd',
          name: 'web-see',
          sourcemap: true,
          plugins: [uglify()],
        },
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: 'ESNext',
            },
          },
          useTsconfigDeclarationDir: true,
        }),
        resolve(),
        commonjs(),
        json(),
      ],
    },
    {
      input: `./packages/${path}/src/index.ts`,
      output: [{ file: `./packages/${path}/dist/index.d.ts`, format: 'es' }],
      plugins: [dts()],
    },
  ];
}

export default [...packageFiles.map((path) => output(path)).flat()];
