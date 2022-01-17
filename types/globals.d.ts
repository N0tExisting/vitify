import type { SSROptions, ViteDevServer } from 'vite';
import { ModuleImport } from './index';

export interface VitifyUserOptions {
	/** @default 8000 */
	port?: number;
	/** @default true */
	//open?: boolean;
	/**
	 * The module that exports the sever
	 */
	app: ModuleImport;
}

export type VitifyOptions = Required<VitifyUserOptions>;

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
