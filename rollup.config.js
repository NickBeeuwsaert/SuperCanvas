import buble from 'rollup-plugin-buble';

export default {
    entry: 'src/SuperCanvas.js',
    dest: 'dist/SuperCanvas.js',
    moduleName: 'SuperCanvas',
    format: 'umd',
    exports: 'named',
    plugins: [
        buble()
    ]
};
