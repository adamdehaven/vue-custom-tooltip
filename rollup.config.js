import commonjs from 'rollup-plugin-commonjs' // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import minimist from 'minimist' // Parse build command

const argv = minimist(process.argv.slice(2)) // Access build arguments as an object

export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: {
    name: 'VueCustomTooltip',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      template: {
        isProduction: true,
        optimizeSSR: argv.format === 'cjs', // Only optimize for SSR in that build
      },
    }),
    buble(), // Transpile to ES5
  ],
}
