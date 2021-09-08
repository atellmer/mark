/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const alias = require('./webpack.alias');
const { createHtmlPluginOptions, domainsMap } = require('./webpack.shared');
const gitRevisionPlugin = new GitRevisionPlugin({
	commithashCommand: 'rev-parse --short HEAD',
});

const createConfig = function (env) {
	const config = {
		mode: 'production',
		devtool: 'source-map',
		resolve: {
			modules: ['node_modules'],
			extensions: ['.ts', '.tsx', '.js', '.json'],
			alias,
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					reactVendor: {
						test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
						name: 'react-vendor',
					},
					vendor: {
						test: /[\\/]node_modules[\\/](!react)(!react-dom)[\\/]/,
						name: 'vendor',
					},
				},
			},
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					sourceMap: true,
					terserOptions: {},
				}),
				new CssMinimizerPlugin(),
			],
		},
		entry: resolve('src/index'),
		output: {
			path: resolve('public'),
			filename: `[name].[hash].bundle.js`,
			library: '[name]',
			publicPath: './',
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
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
			],
		},
		plugins: [
			gitRevisionPlugin,
			new webpack.DefinePlugin({
				'process.browser': JSON.stringify(true),
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
					GIT_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
					GIT_COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
				},
			}),
			new CleanWebpackPlugin({
				verbose: true,
			}),
			new MiniCssExtractPlugin({
				filename: '[hash].style.css',
				chunkFilename: '[id].style.css',
			}),
			new CopyPlugin([
				{
					context: resolve(__dirname, './'),
					from: './src/assets',
					to: './src/assets',
				},
			]),
			new HtmlWebpackPlugin({
				filename: resolve('public', 'index_seeneco_bfm.html'),
				...createHtmlPluginOptions({
					...env,
					domain: domainsMap.seeneco_bfm,
				}),
			}),
			new HtmlWebpackPlugin({
				filename: resolve('public', 'index_sberbank_bfm.html'),
				...createHtmlPluginOptions({
					...env,
					domain: domainsMap.sberbank_bfm,
				}),
			}),
			new HtmlWebpackPlugin({
				filename: resolve('public', 'index_sberbank_invoice.html'),
				...createHtmlPluginOptions({
					...env,
					domain: domainsMap.sberbank_invoice,
				}),
			}),
		],
	};

	if (env.production) {
		config.plugins.push(
			new GenerateSW({
				swDest: './sw.js',
				clientsClaim: true,
				skipWaiting: true,
				maximumFileSizeToCacheInBytes: 6000 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
						handler: 'CacheFirst',
					},
				],
			}),
		);
	}

	return config;
};

module.exports = createConfig;
