import { exec } from 'child_process';

async function installBrew(): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(
			'command -v brew',
			(error: Error | null, stdout: string, stderr: string) => {
				if (error) {
					console.log('Installing brew...');
					exec(
						'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
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
				} else {
					resolve('Brew already installed');
				}
			}
		);
	});
}

export { installBrew };
