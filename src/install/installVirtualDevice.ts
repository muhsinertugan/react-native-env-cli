import { exec } from 'child_process';

/**
 * Installs a virtual device using the Android Virtual Device (AVD) Manager.
 *
 * @param device - The name of the virtual device to be created. Defaults to 'default_device'.
 * @returns A promise that resolves with the standard output of the AVD Manager command, or rejects with an error message.
 *
 * The command executed includes `echo no | avdmanager create avd ...`, where `echo no` is used to automatically respond
 * 'no' to any prompts that might be presented by the `avdmanager create avd` command, ensuring non-interactive execution.
 */
async function installVirtualDevice(
	device: string = 'default_device'
): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(
			`echo no | avdmanager create avd -n ${device} -k "system-images;android-29;google_apis;x86"`,
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

export { installVirtualDevice };
