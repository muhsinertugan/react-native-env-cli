import lodash from 'lodash';
import { ENV_VARIABLES } from '../constants/index.js';

interface EnvCheckResult {
	isValid: boolean;
	value: string | null;
	expectedPath: string;
}

function checkEnvVariables() {
	const userEnvVariables: Record<string, any> = {};

	Object.entries(ENV_VARIABLES).forEach(([envGroup, envGroupValue]) => {
		for (const key in envGroupValue) {
			Object.entries(envGroupValue[key as keyof typeof envGroupValue]).forEach(
				([item, value]) => {
					const userEnvPath = process.env[item];
					const expectedPath = (value as { path?: string })?.path || '';

					const fullExpectedPath = expectedPath.startsWith('~')
						? expectedPath.replace('~', process.env.HOME || '')
						: expectedPath;

					const checkResult: EnvCheckResult = {
						isValid: userEnvPath === fullExpectedPath,
						value: userEnvPath || null,
						expectedPath: fullExpectedPath,
					};

					lodash.set(
						userEnvVariables,
						`${envGroup}.${key}.${item}`,
						checkResult
					);
				}
			);
		}
	});

	return userEnvVariables;
}

function getBasePath(path: string): string {
	if (!path) return '';

	if (path.startsWith('/')) {
		return ''; // Absolute path
	}
	if (path.startsWith('~')) {
		return process.env.HOME ? process.env.HOME + '/' : ''; // Add trailing slash
	}
	return process.env.HOME || '';
}

export { checkEnvVariables };
