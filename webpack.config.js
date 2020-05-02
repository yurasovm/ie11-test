// packages
const path								= require('path')
const glob								= require('glob')
const webpack							= require('webpack')
const fs								= require('fs')
const {CleanWebpackPlugin}				= require('clean-webpack-plugin')
const MiniCssExtractPlugin				= require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin		= require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin				= require('terser-webpack-plugin')
const CopyWebpackPlugin					= require('copy-webpack-plugin')
const EventHooksPlugin					= require('event-hooks-webpack-plugin');

// configs
const chunksConfig						= require('./webpack-config/chunks.js');
const constantsConfig					= require('./webpack-config/constants.js');

// const
const isDev				= process.env.NODE_ENV === 'development'
const isProd			= !isDev
const docComponentsPath	= path.resolve( __dirname, 'src', 'documentation', 'pages' );


const babelLoader = () => {
	return {
		loader	: 'babel-loader',
		options	: {
			'presets': [
				[
				  "@babel/env",
				  {
					"useBuiltIns": "usage",
					"corejs": 3
				  }
				]
			],
			'plugins'	: [
				"@babel/plugin-proposal-class-properties"
			]
		}
	}
}

const optimization = () => {
	const config	= {
		splitChunks	 : { cacheGroups : chunksConfig }
	};

	if ( isProd ) {
		config.minimizer	= [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}

	return config
}

const filename = ext => isDev ? `[name].min.${ext}` : `[name].min.${ext}`

const cssLoaders = extra => {
	const loaders	= [
		{
			loader	: MiniCssExtractPlugin.loader,
			options	: {
				hmr			: isDev,
				reloadAll	: true
			},
		},
		'css-loader',
		'postcss-loader'
	];

	if ( extra ) {
		loaders.push( extra )
	}

	loaders.push({
		loader	: "@epegzz/sass-vars-loader", options: {
			syntax	: 'scss',
			vars	: constantsConfig
		}
	})

	return loaders
}

const plugins = () => {
	const base	= [
		new EventHooksPlugin({
			done	: () => {
				glob.sync( './src/components/**/*.@(svg|png|jpg)', { noext : false } ).forEach( file => {
					const filePath		= path.dirname( file );
					const fileExt		= path.extname( file );
					const fileName		= path.basename( file, fileExt );
					const componentName	= path.normalize( filePath ).split( path.sep ).pop();
			
					const destPath = path.resolve( __dirname, 'assets', 'img', 'components', componentName );

					if( !fs.existsSync( destPath ) ) fs.mkdirSync( destPath, { recursive: true } );
					fs.copyFileSync( file, path.resolve( destPath, path.basename( file ) ) );
				});
			}
		}),
		new CopyWebpackPlugin([{
			from	: path.resolve( __dirname, 'src/assets' ),
			to		: path.resolve( __dirname, 'assets' )
		}]),
		new MiniCssExtractPlugin({
			filename	: filename('css')
		}),
		new webpack.DefinePlugin({
			__CONSTANTS__	: constantsConfig,
		}),
	]

	return base
}

function getBundleEntrys() {
	var ret	= {};

	glob.sync( './src/components/*.js' ).forEach( file => {
		const ext		= path.extname( file );
		const fileName	= path.basename( file, ext );
		ret[ 'js' + path.sep + fileName ]	= file;
	});

	glob.sync( './src/components/*.scss' ).forEach( file => {
		const ext		= path.extname( file );
		const fileName	= path.basename( file, ext );
		ret[ 'css' + path.sep + fileName ]	= file;
	});

	return ret;
}

const getRules = () => {
	let rules	= [
		{
			test	: /\.css$/,
			exclude	: /node_modules/,
			use		: cssLoaders()
		}, {
			test	: /\.scss$/,
			exclude	: /node_modules/,
			use		: cssLoaders('sass-loader')
		}, {
			test	: /\.m?js$/,
			exclude	: /node_modules\/(?!svelte)/,
			use		: [babelLoader()]
		}, {
			test	: /\.svelte$/,
			exclude	: /node_modules\/(?!svelte)/,
			use		: [ babelLoader(), {
				loader	: 'svelte-loader',
				options	: {}
			}]
		}
	];

	return rules;
}

let entrys		= [];
let optputsPath	= [];

entrys		= getBundleEntrys();
optputsPath	= path.resolve( __dirname, 'assets' );

module.exports = [{
	mode			: 'production',
	entry			: entrys,
	optimization	: optimization(),
	devtool			: isDev ? 'inline-source-map' : '',
	plugins			: plugins(),
	resolve			: {
		alias	: {
			svelte		: path.resolve('node_modules', 'svelte'),
			NodeModules	: path.resolve( __dirname, 'node_modules' ),
		},
		extensions	: [ '.mjs', '.js', '.svelte' ],
		mainFields	: [ 'svelte', 'browser', 'module', 'main' ]
	},
	output			: {
		filename	: filename( 'js' ),
		path		: optputsPath
	},
	devServer		: {
		port	: 4200,
		hot		: isDev
	},
	module			: {
		rules: getRules()
	}
}];