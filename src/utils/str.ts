export const escapeString = (str: string, quot: '"' | "'" | '`') => {
	return str
		.replace(/\\/g, '\\\\')
		.replace(/\t/g, '\\t')
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(new RegExp(quot, 'g'), '\\' + quot);
};
