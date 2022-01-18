// @ts-check
import { join, dirname } from 'node:path';
import * as fs from 'node:fs';
import * as console from 'node:console';
import * as process from 'node:process';
import rimraf from 'rimraf';
import chalk from 'chalk';

//console.log(import.meta.url, cleanProtocol(import.meta.url));

const outDir = join(dirname(cleanProtocol(import.meta.url)), '..', 'dist');

const files = {
	'src/index.d.ts': 'index.d.ts',
	'src/vite/index.d.ts': 'vite.d.ts',
	'src/bin/index.d.ts': 'bin.d.ts',
};

/** @param {string} path */
function cleanProtocol(path) {
	if (process.platform === 'win32') {
		if (path.startsWith('file:\\')) {
			path = path.slice('file:\\'.length);
		} else if (path.startsWith('file:///')) {
			path = path.slice('file:///'.length);
		}
	} else {
		if (path.startsWith('file:///')) {
			path = path.slice('file://'.length);
		}
	}
	// Check if the path starts with `file:/` but not `file://`
	if (/^file:\/(?:[^/]|$)/.test(path)) {
		path = path.slice('file:'.length);
	}
	return path;
}

/** @type {false | Error} */
let error = false;
for (const [src, dest] of Object.entries(files)) {
	const srcPath = join(outDir, src);
	const destPath = join(outDir, dest);
	//console.log(`'${srcPath}' -> '${destPath}'`);
	try {
		fs.copyFileSync(srcPath, destPath);
	} catch (err) {
		console.error(`Error copying file '${src}' → '${dest}'`);
		// @ts-expect-error - we know this is an Error
		error = err;
		break;
	}
}

if (error) {
	throw error;
} else {
	rimraf.sync(outDir);
	console.log(chalk.magentaBright`Copied types!`);
}
