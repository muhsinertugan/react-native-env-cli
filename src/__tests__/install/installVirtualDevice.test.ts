import { exec } from 'child_process';
import { installVirtualDevice } from '../../install/installVirtualDevice.js';

// Mock child_process.exec
jest.mock('child_process');
const mockedExec = exec as jest.MockedFunction<typeof exec>;

describe('installVirtualDevice', () => {
	beforeEach(() => {
		// Clear mock before each test
		jest.clearAllMocks();
	});

	it('should successfully create a virtual device with default name', async () => {
		// Mock successful execution
		mockedExec.mockImplementation((cmd, callback: any) => {
			callback(null, 'Virtual device created successfully', '');
			return {} as any;
		});

		const result = await installVirtualDevice();

		// Verify the command was called with correct parameters
		expect(mockedExec).toHaveBeenCalledWith(
			'echo no | avdmanager create avd -n default_device -k "system-images;android-29;google_apis;x86"',
			expect.any(Function)
		);
		expect(result).toBe('Virtual device created successfully');
	});

	it('should successfully create a virtual device with custom name', async () => {
		mockedExec.mockImplementation((cmd, callback: any) => {
			callback(null, 'Virtual device created successfully', '');
			return {} as any;
		});

		const result = await installVirtualDevice('test_device');

		expect(mockedExec).toHaveBeenCalledWith(
			'echo no | avdmanager create avd -n test_device -k "system-images;android-29;google_apis;x86"',
			expect.any(Function)
		);
		expect(result).toBe('Virtual device created successfully');
	});

	it('should reject when exec returns an error', async () => {
		const errorMessage = 'Command failed';
		mockedExec.mockImplementation((cmd, callback: any) => {
			callback(new Error(errorMessage), '', '');
			return {} as any;
		});

		await expect(installVirtualDevice()).rejects.toEqual(
			`error: ${errorMessage}`
		);
	});

	it('should reject when exec returns stderr', async () => {
		const stderrMessage = 'stderr message';
		mockedExec.mockImplementation((cmd, callback: any) => {
			callback(null, '', stderrMessage);
			return {} as any;
		});

		await expect(installVirtualDevice()).rejects.toEqual(
			`stderr: ${stderrMessage}`
		);
	});
});
