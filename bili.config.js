module.exports = {
    input: 'src/index.js',
    banner: true,
    externals: ['vue'],
    output: {
        fileName: (context, defaultFileName) => {
            if (context.format === 'cjs' || context.format === 'esm') {
                return 'vue-custom-tooltip[min][ext]';
            }
            return 'vue-custom-tooltip[min].[format].js';
        },
        format: [
            'cjs',
            'es',
            'umd',
            'iife',
        ],
        dir: 'dist',
        extractCSS: false,
        minify: true,
        moduleName: 'VueCustomTooltip',
    },
    plugins: {
        commonjs: true,
        vue: true,
    },
    bundleNodeModules: true,
}