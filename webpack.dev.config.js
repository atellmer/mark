/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const alias = require('./webpack.alias');
const { createHtmlPluginOptions } = require('./webpack.shared');

const gitRevisionPlugin = new GitRevisionPlugin({
	commithashCommand: 'rev-parse --short HEAD',
});

const createConfig = function (env) {
	const config = {
		mode: 'development',
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json'],
			alias,
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
		devtool: 'eval-source-map',
		entry: resolve('src/index'),
		output: {
			path: resolve('public'),
			publicPath: '/',
			filename: 'build.js',
		},
		devServer: {
			contentBase: join(__dirname, 'public'),
			compress: false,
			port: 9001,
			historyApiFallback: true,
			proxy: {
				'/atr-framework-services': {
					target: `https://localhost/`,
					secure: false,
					changeOrigin: true,
				},
				'/atr-document-services': {
					target: `https://localhost/`,
					secure: false,
					changeOrigin: true,
				},
				'/tenant-public-resources': {
					target: `https://localhost/`,
					secure: false,
					changeOrigin: true,
				},
				'/bfm': {
					target: `https://localhost/`,
					secure: false,
					changeOrigin: true,
				},
				'/auth': {
					target: `https://localhost/`,
					secure: false,
					changeOrigin: true,
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|ts|tsx)$/,
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
					},
				},
				{
					test: /\.(jpe?g|png)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								outputPath: 'resources',
							},
						},
					],
				},
				{
					test: /\.svg$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8 * 1024,
							},
						},
					],
				},
				{
					test: /\.(css|scss)$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								sourceMap: env.production,
							},
						},
					],
				},
			],
		},
		plugins: [
			gitRevisionPlugin,
			new webpack.DefinePlugin({
				'process.browser': JSON.stringify(true),
				'process.env': {
					NODE_ENV: JSON.stringify('development'),
					GIT_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
					GIT_COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
				},
			}),
			new MiniCssExtractPlugin({
				filename: 'style.css',
			}),
			new HtmlWebpackPlugin({
				filename: resolve('public', 'index.html'),
				...createHtmlPluginOptions(env),
			}),
		],
	};

	return config;
};

module.exports = createConfig;
