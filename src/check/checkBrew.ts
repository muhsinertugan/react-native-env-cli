//check if the tools are installed from the brew

import { exec } from 'child_process';
import { TOOL_GROUPS, TOOLS } from '../constants/versions.js';

async function checkBrew(): Promise<boolean> {
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
		await execPromise('brew --version');
		return true;
	} catch (error) {
		return false;
	}
}

export { checkBrew };
