import { TOOLS } from '../constants/index.js';
import { ToolGroups } from '../types/toolTypes.js';
import envinfo from 'envinfo';

interface UserEnv {
	[key: string]: {
		[key: string]: {
			version: string;
		};
	};
}

async function getEnv(): Promise<UserEnv> {
	const toolGroupsArray = Object.keys(TOOLS);

	const config = toolGroupsArray.reduce((result, toolGroup) => {
		const tools = Object.keys(TOOLS[toolGroup as keyof typeof TOOLS]);
		return { ...result, [toolGroup]: tools };
	}, {});

	const options = {
		json: true,
		showNotFound: true,
	};

	const env = await envinfo.run(config, options);

	const envJSON = JSON.parse(env.trim());

	return envJSON;
}

export { getEnv };
