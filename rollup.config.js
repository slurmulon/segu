import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'segu',
      file: pkg.browser,
      // format: 'umd',
      format: 'esm',
      esModule: false,
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      json(),
      resolve(),
      commonjs({
        esmExternals: true,
        requireReturnsDefault: true
      }),
      getBabelOutputPlugin({
        presets: [['@babel/preset-env', { modules: 'umd' }]],
        // plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]]
      }),
    ]
  },
  {
    input: 'src/index.js',
    // external: [/@babel\/runtime/, 'ajv', 'bach-cljs', 'bach-json-schema', 'teoria'],
    external: [/@babel\/runtime/],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        plugins: [getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
          // plugins: [['@babel/plugin-transform-runtime', { corejs: 3, useESModules: false }]]
        })]
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        plugins: [
          getBabelOutputPlugin({
            presets: [['@babel/preset-env', { modules: 'umd' }]],
            // plugins: [['@babel/plugin-transform-runtime', { corejs: 3, useESModules: true }]]
          })
        ]
      }
    ],
    plugins: [
      json(),
      resolve()
    ]
  }
]
