const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { uglify } = require('rollup-plugin-uglify');

const getUmdConfig = (isProd) => ({
  input: './src/index.js',
  output: {
    file: `dist/redux-utils${isProd ? '.min' : ''}.js`,
    format: 'umd',
    name: 'ReduxUtils',
  },
  plugins: [
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      exclude: /node_modules/,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProd ? 'production' : 'development'
      ),
    }),
    sizeSnapshot(),
    isProd ? uglify() : null,
  ],
});

module.exports = [false, true].map(getUmdConfig);
