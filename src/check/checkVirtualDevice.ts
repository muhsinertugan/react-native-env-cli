import { exec } from 'child_process';

//check if an android emulator or ios simulator is installed on the pc
async function checkVirtualDevices(): Promise<{
	androidDevices: string[];
	iosDevices: string[];
}> {
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

	return Promise.all([
		execPromise('emulator -list-avds'),
		execPromise('xcrun simctl list devices'),
	])
		.then(([androidOutput, iosOutput]) => {
			const androidDevices = androidOutput
				.split('\n')
				.filter((device) => device.trim() !== '');
			const iosDevices = iosOutput
				.split('\n')
				.filter(
					(device) =>
						device.includes('(Shutdown)') || device.includes('(Booted)')
				)
				.map((device) => device.trim());
			return { androidDevices, iosDevices };
		})
		.catch((error) => {
			console.error(error);
			return { androidDevices: [], iosDevices: [] };
		});
}

export { checkVirtualDevices };
