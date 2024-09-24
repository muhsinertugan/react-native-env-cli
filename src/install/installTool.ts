import { exec } from 'child_process';

async function installTool(tool) {
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
