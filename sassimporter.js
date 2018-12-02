const path = require('path');

function tryResolve_(url, sourceFilename) {
	// Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
	// when the importer throws
	try {
		console.log('Searching: ' + url + ' under: ' + path.dirname(sourceFilename));
		return require.resolve(url, { paths: [path.dirname(sourceFilename)] });
	} catch (e) {
		console.log(e);
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
		console.log('Material URL: ' + url + ', prev: ' + prev);
		const resolved = tryResolveScss(url, prev);
		return { file: resolved || url };
	}
	return { file: url };
}

module.exports = materialImporter;
