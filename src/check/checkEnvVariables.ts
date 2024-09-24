import lodash from 'lodash';
import { ENV_VARIABLES } from '../constants/index.js';

/**
 * TODO:we need to check if they are correct, we need to set these variables in some state if they are not correct
 */
function checkEnvVariables() {
	const userEnvVariables = {};

	Object.entries(ENV_VARIABLES).map(([envGroup, envGroupValue]) => {
		for (const key in envGroupValue) {
			Object.entries(envGroupValue[key as keyof typeof envGroupValue]).map(
				([item, value]) => {
					const userEnvPath = process.env[item];

					/**
					 * !!Not everything is under Home find a wat to include all types of env things
					 */
					const checkEnvItem =
						`${process.env['HOME']}${(value as { path: string }).path}` ===
						userEnvPath;

					lodash.set(
						userEnvVariables,
						`${envGroup}.${key}.${item}`,
						checkEnvItem
					);
				}
			);
		}
		return userEnvVariables;
	});

	return userEnvVariables;
}

export { checkEnvVariables };
