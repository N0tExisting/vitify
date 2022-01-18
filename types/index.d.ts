import { FastifyInstance } from 'fastify';

export type ModuleExport = {
	/** The path to the module */
	path: string;
	/**
	 * The name of the export
	 * @default 'default'
	 */
	name: string;
};

/** The path to a module & optionally the name of the export */
export type ModuleImport = ModuleExport | string;

export type ServerExport = FastifyInstance;

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

export type VitifyResolvedOptions = Required<VitifyUserOptions>;
