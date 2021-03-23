// rollup.config.js
import json from 'rollup-plugin-json'
// import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import rollupTypescript  from 'rollup-plugin-typescript'
const pkg = require('./package.json')

export default {
    input: 'src/player.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: pkg.className,
        },
        {
            file: pkg.module,
            format: 'esm',
        },
    ],
    plugins: [json(), resolve(), common(), rollupTypescript()],
}
