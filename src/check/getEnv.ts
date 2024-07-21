import { TOOLS, TOOL_GROUPS } from '../constants/index.js';
import { ToolGroups } from '../types/toolTypes.js';
import envinfo from 'envinfo';

async function getEnv() {
	const toolGroupsArray = Object.keys(TOOL_GROUPS);

	const config = toolGroupsArray.reduce((result, toolGroup) => {
		const tools = Object.keys(TOOLS[toolGroup as keyof ToolGroups]);
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
