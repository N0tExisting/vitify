export interface IMessage<
	T extends string = string,
	P extends object = object,
> {
	type: T;
	payload: P;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface -- Allow for extending like the commented out code below
export interface Message extends IMessage {}

/* * @internal * /
declare module 'vite' {
	interface UserConfig {
		$$Vitify: {
			interchange: {
				to: (msg: Message) => void;
			};
		};
	}
}*/
