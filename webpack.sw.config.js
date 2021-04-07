var path = require('path');
var webpack = require('webpack');
// const fs = require('fs-extra');

module.exports = {
 entry: './service_worker/sw.js',
 mode: 'production',
 target: ['web', 'es5'],
 output: {
   path: path.resolve(__dirname, 'dist'),
   filename: 'sw.js'
 },

 module: {
   rules: [
     { test: /\.js/, use: 'babel-loader' },
   ]
 },
 stats: {
     colors: true
 },
};
