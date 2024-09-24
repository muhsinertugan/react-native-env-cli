type EnvGroups = {
	Android_SDK: {
		ANDROID_HOME: {
			path: string;
		};
		ANDROID_SDK_ROOT: {
			path: string;
		};
	};
	Java_JDK: {
		JAVA_HOME: {
			path: string;
		};
	};
};

type EnvTypes = {
	[K in keyof EnvGroups]: {
		[T in keyof EnvGroups[K]]: {
			path: string;
		};
	};
};

export { type EnvTypes, type EnvGroups };
