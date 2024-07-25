type EnvGroups = {
	SDKs: {
		Android_SDK: {
			ANDROID_HOME: 'ANDROID_HOME';
			ANDROID_SDK_ROOT: 'ANDROID_SDK_ROOT';
		};
	};
};

type EnvTypes = {
	[K in keyof EnvGroups]: {
		[T in keyof EnvGroups[K]]: {
			[P in keyof EnvGroups[K][T]]: {
				path: string;
			};
		};
	};
};

export { type EnvTypes, type EnvGroups };
