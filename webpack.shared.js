/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

function createHtmlPluginOptions(env) {
	const isProduction = Boolean(env.production);
	const map = {
		template: resolve('src', 'ui', 'index.ejs'),
		hash: !isProduction,
		inject: false,
		baseURL: '/',
		title: 'Mark',
	};

	return map;
}

module.exports = {
	createHtmlPluginOptions,
};
