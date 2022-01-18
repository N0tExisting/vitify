/// <reference types="middie" />
import { createServer } from 'node:http';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { createServer as createViteServer } from 'vite';
import type { FastifyInstance } from 'fastify';
import pkg from '$package';
import type { ModuleImport } from '$type';

type Awaitable<T> = Promise<T> | T;
type ServerExport = Awaitable<FastifyInstance>;

//* https://github.com/yargs/yargs/tree/main/docs
yargs(hideBin(process.argv))
	.usage('Usage: $0 <command> [options]')
	.command(
		['$0', 'dev'],
		'Start development server (default)',
		(a) => {
			return a
				.number('p')
				.alias('p', 'port')
				.describe('p', 'Port to listen on');
		},
		async (args) => {
			const vite = await createViteServer({
				server: {
					open: false,
				},
			});

			if (args.p) {
				vite.config.vitify.port = args.p;
			} else if (!vite.config.vitify.port) {
				vite.config.vitify.port = 8000;
			}

			const opts = vite.config;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			async function loadModule<T = any>(exp: ModuleImport) {
				const file = typeof exp === 'string' ? exp : exp.path;
				const name = typeof exp === 'string' ? 'default' : exp.name;
				const mod = await vite.ssrLoadModule(file);
				return mod[name] as T;
			}

			//* SEE: https://vitejs.dev/config/#server-options
			const server = createServer(async (req, res) => {
				const fastify = await await loadModule<ServerExport>(opts.vitify.app);
				if (!('vite' in fastify)) {
					fastify.decorate('vite', vite);
					if (opts.vitify.inject) {
						fastify.use(vite.middlewares);
					}
				}
				await fastify.ready();
				await fastify.routing(req, res);
			});

			server.listen({ port: opts.vitify.port, host: opts.server.host }, () => {
				const addr = server.address();
				const log = console.log;
				if (addr != undefined && typeof addr === 'object') {
					log(`Server Listening on http://${addr.address}:${addr.port}`);
				} else if (typeof addr === 'string') {
					log(`Server Listening on http://${addr}`);
				} else {
					if (typeof opts.server.host === 'string') {
						log(
							`Server Listening on http://${opts.server.host}:${opts.vitify.port}`,
						);
					} else {
						log(`Server Listening on port ${opts.vitify.port}`);
					}
				}
			});
		},
	)
	// TODO: Commands: Preview, Build
	.demandCommand()
	.recommendCommands()
	.version('ver', pkg.version)
	.alias('ver', 'version')
	.alias('ver', 'v')
	.help('h')
	.alias('h', 'help');
