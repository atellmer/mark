/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { resolve } = require('path');

const alias = {
	'@styles': resolve(__dirname, './src/core/styles'),
	'@api': resolve(__dirname, './src/core/api'),
	'@utils': resolve(__dirname, './src/core/utils'),
	'@ui': resolve(__dirname, './src/core/ui'),
	'@routing': resolve(__dirname, './src/core/routing'),
	'@theme': resolve(__dirname, './src/core/theme'),
	'@hooks': resolve(__dirname, './src/core/hooks'),
	'@modules': resolve(__dirname, './src/modules'),
	'@assets': resolve(__dirname, './src/assets'),
};

module.exports = alias;
