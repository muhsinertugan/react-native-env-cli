import { EnvTypes } from '../types/envTypes.js';

const ENV_VARIABLES: EnvTypes = {
	Android_SDK: {
		ANDROID_HOME: { path: '/Library/Android/sdk' },
		ANDROID_SDK_ROOT: { path: '/Library/Android/sdk' },
	},
	Java_JDK: {
		JAVA_HOME: {
			path: '/path/to/java/home',
		},
	},
};

export { ENV_VARIABLES };
