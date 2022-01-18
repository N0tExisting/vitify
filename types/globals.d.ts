import type { SSROptions, ViteDevServer } from 'vite';
import { VitifyUserOptions, VitifyResolvedOptions } from './index';

declare module 'fastify/types/instance' {
	interface FastifyInstance {
		vite?: ViteDevServer;
	}
}

declare module 'vite' {
	interface UserConfig {
		vitify: VitifyUserOptions;
		ssr?: SSROptions;
	}
	interface InlineConfig {
		vitify?: VitifyUserOptions;
	}
}
