'use strict';

// рабочее окружение для продакшена и девелопмента (если нет NODE_ENV то 'development')
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const rucksack = require('rucksack-css');
const precss       = require('precss');
const cssnano = require('cssnano');
const cssnext = require("postcss-cssnext");
const postcssNested = require('postcss-nested');
// const autoprefixer = require('autoprefixer');
// const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const BowerWebpackPlugin = require('bower-webpack-plugin');
const json = require("json-loader");
// const pug = require("pug-loader");
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// css files
// let extractCSS = new ExtractTextPlugin('../css/[name].css',{
// 	allChunks: true,
// 	disable: process.env.NODE_ENV=='development'
// });

module.exports = {
		entry: {
			// указываем абсолютную директорию где находяться модули
			main : "./src/js/app/main",
			// age : "./src/js/app/age",
			// about : "./app/js/about",
			// main : "./app/js/main",
		},
    output: {
				path: __dirname + '/build/',
				// интернет путь к файлу, место размещения файла на сервере

				publicPath: '/js/', //__dirname использую пока нет локального сервера

				// создаем шаблон в который подставляються имена из entry
        filename: "[name].js",
				// в bundle создает переменную(объект) чтобы использовать внутринее функции из бандла
				library:'[name]',
    },
		// watch: NODE_ENV == 'development',
		watch: true,

		// watchOptions : {
		// 	// задержка перед сборкой изменненого файла (default 300)
		// 	aggregateTimeout : 100
		// },
		resolve: {
        extensions: ['', '.js', '.jsx']
    },

		devtool : NODE_ENV == 'development' ? 'souce-map' : null,
		// devtool : 'souce-map',

		// чтобы рекваерить лодаш from cdn
		// externals : {
		// 	lodash : '_'
		// },

		module: {
		  loaders: [
		    {
		      test: /\.js$/,
		      exclude: /(node_modules|src\/vendor)/, // не проганять файли через babel
		      loader: 'babel', // 'babel-loader' is also a valid name to reference
		      query: {
		        presets: ['es2015',"react"],
						plugins: ['transform-runtime',]
		      }
		    },
				{
          	test: /\.jsx$/,
						loader: 'jsx-loader'
        },
				{
          	test: /\.json$/,
						loader: 'json-loader'
        },
				{
          	test: /\.pug$/,
						loader: 'pug-loader?pretty',
        },
				// {
        //   	test: /\.pug$/,
				// 		loader: 'pug-html-loader?pretty',
        // },
				// pug
				// {
        //   	test: /\.css$/,
				// 		loader: extractCSS.extract('style','css!postcss'),
        // },
				{
	        test: /\.scss$/,
	        loaders: ["style-loader", "css-loader", "sass-loader"]
	      },
				{
          	test: /\.css$/,
						loaders: [
							'style',
							'css',
							'postcss',
							'resolve-url-loader'
						],
        },
				// Font Definitions
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff',
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff2',
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream',
        }, {
          test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-otf',
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file',
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml',
        },
				// {
        //     test: /\.woff2?$|\.ttf$|\.eot$/,
        //     loader: 'file?name=[path][name].[ext]&publicPath=src/fonts/&outputPath=build/fonts/'
        //     // loader:'url?name=[path][name].[ext]&limit=4096',
        // },
	      { test: /\.png$/, loader: "url?limit=100000&name=[name].[ext]" },
	      { test: /\.jpg$/, loader: "file?name=[name].[ext]" }
				// {
        //     test: /\.svg$|\.png|\.jpeg?|\.gif$/,
        //     // loader: 'file?name=[path][name].[ext]'
        //     loaders:['file?name=../img/[name].[ext]&publicPath=src/img/&outputPath=build/img/','image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'],
        // },
				// {
        //     test: /\.svg$|\.png|\.jpeg?|\.gif$/,
        //     // loader: 'file?name=[path][name].[ext]'
        //     loaders:['file?name=../img/[name].[ext]&publicPath=src/img/&outputPath=build/img/','image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'],
        // },
		  ],

			noParse:  /\/src\/vendor/,
		},

			postcss: function () {
        return [
          cssnext(),
          postcssNested(),
          precss(),
          rucksack({
  		      autoprefixer: false
  		    }),
          cssnano({
            discardComments : {
              removeAll : true
            },
            discardUnused : false,
            mergeIdents   : false,
            reduceIdents  : false,
            safe          : true,
            sourcemap     : true
          }),
        ];
				// if (NODE_ENV == 'production') {
				// } else {
				// 	return [precss,
				// 		rucksack({
				//       autoprefixer: true
				//     }),
				// 	];
				// }

	    },

			plugins : [
				// не делает сборку если есть ошибки
				new webpack.NoErrorsPlugin(),
				// передаем переменную(NODE_ENV) в окружение, чтобы модули её видели
				new webpack.DefinePlugin('NODE_ENV'),
				// создает файл где находиться повторяющийся код и других скриптов
				new webpack.optimize.CommonsChunkPlugin({
					name : "main",
					// собирать в один файл если модуль используется хотя бы в 2 файлах
					minChunks: 2,
				}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new NpmInstallPlugin(),
				new webpack.optimize.UglifyJsPlugin({
				    compress: {
				        warnings: false,
				    }
				}),
				// предоставляет глобальные переменные типа (_) lodash, ($) jquery / будет подключаться в каждый файл и увеличивать размер :(
				new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
					// _forEach : 'lodash/forEach',
					// _: 'lodash/',
				}),
				// css files
				// extractCSS,
				// bower files
				new BowerWebpackPlugin({
					modulesDirectories: ['src/vendor'],
					manifestFiles: ['bower.json', '.bower.json'],
					includes: /.*/,
					excludes: /.*\.less$/,
					// searchResolveModulesDirectories: false
				}),
				// pug
				// new HtmlWebpackPlugin({
				// 	filename: '../index.html',
				// 	inject: false,
				// 	title: 'Custom template using Pug',
				// 	template: './app/pug/index.pug'
				// }),
				// new HtmlWebpackPlugin({
				// 	filename: '../about.html',
				// 	inject: false,
				// 	title: 'Custom template using Pug',
				// 	template: './app/pug/about.pug'
				// }),
				// new webpack.HotModuleReplacementPlugin(),
			],

      node: {
        fs: "empty"
      },

			// DEV server
			// devServer : {
			// 	port : 8080,
			// 	host : 'localhost',
			// 	// contentBase: '/build',
			// 	hot : true
			// }

};

// min js
// if (NODE_ENV == 'production') {
// 	module.exports.plugins.push(
// 		new webpack.optimize.UglifyJsPlugin({
// 		    compress: {
// 		        warnings: false,
// 		    }
// 		})
// 	);
// };
