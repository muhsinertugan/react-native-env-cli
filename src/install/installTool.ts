import { exec } from 'child_process';
import type { ToolDefinition } from '../types/toolTypes.js';

async function installTool(tool: ToolDefinition): Promise<string> {
	if (!tool.brewCommand) {
		throw new Error(`No brew command found for ${tool.name}`);
	}

	return new Promise((resolve, reject) => {
		exec(
			`brew install ${tool.brewCommand}`,
			(error: Error | null, stdout: string, stderr: string) => {
				if (error) {
					reject(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					reject(`stderr: ${stderr}`);
					return;
				}
				resolve(stdout);
			}
		);
	});
}

export { installTool };
