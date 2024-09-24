//check if the tools are installed from the brew

import { exec } from 'child_process';
import { TOOL_GROUPS, TOOLS } from '../constants/versions.js';

async function checkBrew(): Promise<string> {
	const execPromise = (command: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			exec(command, (error: Error | null, stdout: string, stderr: string) => {
				if (error) {
					reject(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					reject(`stderr: ${stderr}`);
					return;
				}
				resolve(stdout);
			});
		});
	};

	try {
		const brewOutput = await execPromise('brew list');
		const installedTools = brewOutput.split('\n').filter(Boolean);
		const missingTools: string[] = [];

		for (const group of Object.values(TOOL_GROUPS)) {
			for (const tool of Object.values(TOOLS[group])) {
				if (tool.brewCommand && !installedTools.includes(tool.brewCommand)) {
					missingTools.push(tool.name);
				}
			}
		}

		if (missingTools.length > 0) {
			return `Missing tools: ${missingTools.join(', ')}`;
		} else {
			return 'All tools are installed';
		}
	} catch (error) {
		console.error(error);
		return 'Error checking brew tools';
	}
}

export { checkBrew };
