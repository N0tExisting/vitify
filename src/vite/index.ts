import { escapeString } from '$util';
import type { Plugin } from 'vite';
import pkg from '$package';

/*declare module 'vite' {
	interface Plugin {
		//name: string;
	}
}*/

// Virtual module prefix
const VMOD_PRE = '#vitify/';

export type VitifyViteConfig = {
	configurer: string;
};

// prettier-ignore
type LoadOpts = {
	ssr?: boolean | undefined;
} | undefined;

const mods: Record<string, (opts: LoadOpts, cfg: VitifyViteConfig) => string> =
	{
		dist: (_, cfg) => /* @js */ `
import { PrepareServer } from '${escapeString(cfg.configurer, "'")}';
import Fastify from 'fastify';
const app = Fastify();
prepareServer(app);
export default app;
`,
	};

/**
 * @deprecated This was meant to be used as a way to load the server via virtual modules, but later scrapped.
 * @param config The config
 * @returns The plugin
 */
const VitePlugin = (config: VitifyViteConfig): Plugin => {
	return {
		name: pkg.name,
		config(cfg, env) {
			if (env.command === 'serve') {
				if (!cfg.server) cfg.server = {};
				cfg.server.base = '/';
				cfg.server.open = false;
				//cfg.server.middlewareMode = 'ssr';
			}
		},
		resolveId(id) {
			if (id.startsWith(VMOD_PRE)) {
				const mod = id.slice(VMOD_PRE.length);
				if (mods[mod]) return '\u0000' + id;
			}
			// eslint-disable-next-line unicorn/no-null -- needed for rollup
			return null;
		},
		load: (id, opts) => {
			if (id.startsWith(VMOD_PRE)) {
				const mod = mods[id.slice(VMOD_PRE.length)];
				if (mod) return mod(opts, config);
			}
			// eslint-disable-next-line unicorn/no-null -- needed for rollup
			return null;
		},
	};
};

export default VitePlugin;
