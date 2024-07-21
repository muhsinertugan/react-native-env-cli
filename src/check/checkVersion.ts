import commandExists from 'command-exists';
import semver from 'semver';
import { TOOLS } from '../constants/versions.js';
import { ToolGroups } from '../types/toolTypes.js';
import { getEnv } from './getEnv.js';

async function checkVersion() {
	const userEnv = await getEnv();

	const results = {};

	await Promise.all(
		Object.entries(userEnv).map(async ([toolGroup, _toolInfo]) => {
			for (const key in TOOLS[toolGroup as keyof ToolGroups]) {
				try {
					const exists = await commandExists(
						TOOLS[toolGroup as keyof ToolGroups][key]!.command
					);

					if (exists) {
						const satisfies = semver.satisfies(
							userEnv[toolGroup][key].version,
							TOOLS[toolGroup as keyof ToolGroups][key]!.versionRange
						);

						(results as Record<string, boolean>)[key] = satisfies;
					}
				} catch (error) {
					console.log(error);
				}
			}
		})
	);

	return results;
}
export { checkVersion };
