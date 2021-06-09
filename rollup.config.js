import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs' // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble' // Transpile/polyfill with reasonable browser support
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

function createEntry({ file, format, minify }) {
  const config = {
    input: './src/index.ts',
    external: ['vue'],
    output: {
      name: 'VueCustomTooltip',
      file: file,
      format: format,
      exports: 'default',
      globals: {
        vue: 'Vue',
      },
    },
    plugins: [
      postcss({
        extract: false,
        inject: true,
        minimize: true,
        modules: false,
        use: ['sass'],
      }),
      typescript(),
      vue({
        css: true,
        template: {
          optimizeSSR: format === 'cjs',
        },
      }),
      buble(), // Transpile to ES5
    ],
  }

  if (format !== 'es') {
    config.plugins.push(commonjs())
  }

  if (minify) {
    config.plugins.push(terser())
  }

  return config
}

export default [
  createEntry({ format: 'cjs', file: pkg.main, minify: false }),
  createEntry({ format: 'es', file: pkg.module, minify: false }),
  createEntry({ format: 'iife', file: pkg.unpkg, minify: true }),
]
