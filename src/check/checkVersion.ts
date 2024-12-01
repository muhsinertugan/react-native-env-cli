import { exec } from 'child_process';
import commandExists from 'command-exists';
import semver from 'semver';
import { TOOLS } from '../constants/versions.js';
import { getEnv } from './getEnv.js';

async function checkVersion() {
	const userEnv = await getEnv();
	const results: Record<string, boolean> = {};

	await Promise.all(
		Object.entries(userEnv).map(async ([toolGroup, toolInfo]) => {
			const tools = TOOLS[toolGroup as keyof typeof TOOLS];
			if (!tools) return;

			for (const key in tools) {
				try {
					// Special handling for Android Studio
					if (key === 'Android Studio') {
						// On macOS
						const macPath = '/Applications/Android Studio.app';
						// On Windows
						const winPath = 'C:\\Program Files\\Android\\Android Studio';

						const exists = await new Promise((resolve) => {
							exec('android studio -version', (error) => {
								if (error) {
									// Try checking if the directory exists instead
									import('fs').then((fs) => {
										resolve(fs.existsSync(macPath) || fs.existsSync(winPath));
									});
								} else {
									resolve(true);
								}
							});
						});

						results[key] = exists as boolean;
						continue;
					}

					const toolConfig = tools[key];
					if (!toolConfig) continue;

					const exists = await commandExists(toolConfig.command);

					if (exists) {
						const toolGroupInfo = toolInfo[key];
						if (!toolGroupInfo) continue;

						if (key === TOOLS.IDEs.Xcode?.name) {
							const userXcodeVersion = `${
								toolGroupInfo.version.split('/')[0]
							}.0`;
							const satisfies = semver.satisfies(
								userXcodeVersion,
								toolConfig.versionRange
							);
							results[key] = satisfies;
						} else if (key === TOOLS.Binaries.Watchman?.name) {
							results[key] = true;
						} else {
							const satisfies = semver.satisfies(
								toolGroupInfo.version,
								toolConfig.versionRange
							);
							results[key] = satisfies;
						}
					}
				} catch (error) {
					console.log(error);
					results[key] = false;
				}
			}
		})
	);

	return results;
}
export { checkVersion };
