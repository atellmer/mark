/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { resolve } = require('path');

const alias = {
	'@core': resolve(__dirname, './src/core'),
	'@ui': resolve(__dirname, './src/ui'),
	'@utils': resolve(__dirname, './src/utils'),
	'@datasets': resolve(__dirname, './src/datasets'),
};

module.exports = alias;
