// @ts-check
import { resolve } from 'node:path';
import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

/**
 * Gets a regex to match an import to the given Dependency.
 * @param {string} dep the dependency name
 * @returns {RegExp} The regex
 */
const getDepRegex = (dep) => new RegExp(`^${dep}(?:/.*)?$`);

const external = [
	...Object.keys(pkg.dependencies).map(getDepRegex),
	...Object.keys(pkg.peerDependencies).map(getDepRegex),
	/^node:/,
	resolve(__dirname, 'package.json'),
];

console.log('Externals:', external /* , '\n\n\n\n\n\n\n\n\n\n' */);

export default defineConfig({
	plugins: [
		typescript({
			include: [
				'*.js+(|x)',
				'**/*.js+(|x)',
				'*.ts+(|x)',
				'**/*.ts+(|x)',
				'*.d.ts+(|x)',
				'**/*.d.ts+(|x)',
			],
			exclude: ['node_modules/**'],
		}),
	],
	input: {
		index: 'src/index.ts',
		bin: 'src/bin/index.ts',
		vite: 'src/vite/index.ts',
		//fastify: 'src/fastify/index.ts',
	},
	output: {
		dir: 'dist',
		format: 'esm',
		sourcemap: true,
	},
	external,
});
