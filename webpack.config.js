const autoprefixer = require('autoprefixer');
const path = require('path');

function tryResolve_(url, sourceFilename) {
	// Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
	// when the importer throws
	try {
		return require.resolve(url, { paths: [path.dirname(sourceFilename)] });
	} catch (e) {
		return '';
	}
}

function tryResolveScss(url, sourceFilename) {
	// Support omission of .scss and leading _
	const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
	return (
		tryResolve_(normalizedUrl, sourceFilename) ||
		tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`), sourceFilename)
	);
}

function materialImporter(url, prev) {
	if (url.startsWith('@material')) {
		const resolved = tryResolveScss(url, prev);
		return { file: resolved || url };
	}
	return { file: url };
}

module.exports = {
	entry: './dist/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'mobile-verification.js'
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.scss']
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'mobile-verification.css'
						}
					},
					{ loader: 'extract-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer()]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							importer: materialImporter
						}
					}
				]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['transform-object-assign']
				}
			}
		]
	}
};
