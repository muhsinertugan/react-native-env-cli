import lodash from 'lodash';
import { ENV_VARIABLES } from '../constants/envVariables.js';
import { EnvCategoriesList, EnvGroups } from '../types/envTypes.js';
/**
 * TODO:we need to check if they are correct, we need to set these variables in some state if they are not correct
 */
function checkEnvVariables() {
	const userEnvVariables = {};

	Object.entries(ENV_VARIABLES).map(([envGroup, _test]) => {
		for (const key in ENV_VARIABLES[envGroup as keyof EnvGroups]) {
			Object.entries(
				ENV_VARIABLES[envGroup as keyof EnvGroups][
					key as keyof EnvCategoriesList
				]
			).map(([item, value]) => {
				const userEnvPath = process.env[item];

				/**
				 * !!Not everything is under Home find a wat to include all types of env things
				 */
				const checkEnvItem =
					`${process.env['HOME']}${value.path}` === userEnvPath;

				lodash.set(
					userEnvVariables,
					`${envGroup}.${key}.${item}`,
					checkEnvItem
				);
			});
		}
		return userEnvVariables;
	});

	return userEnvVariables;
}

export { checkEnvVariables };
