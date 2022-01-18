import { escapeString } from './str';
import type { ModuleImport } from '$type';

export const getImport = (imp: ModuleImport, name: string): string => {
	if (typeof imp === 'string') {
		return `import ${name} from'${escapeString(imp, "'")}';`;
	}
	return `import{${imp.name} as ${name}}from'${escapeString(imp.path, "'")}';`;
};
