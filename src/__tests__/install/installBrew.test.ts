import { exec } from 'child_process';
import { installBrew } from '../../install/installBrew.js';

// Mock child_process.exec
jest.mock('child_process');
const mockedExec = exec as jest.MockedFunction<typeof exec>;

describe('installBrew', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		// Restore console.log to prevent logging during tests
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	it('should return "Brew already installed" when brew exists', async () => {
		// Mock exec to simulate brew already being installed
		mockedExec.mockImplementation((command, callback: any) => {
			callback(null, '/usr/local/bin/brew', '');
			return {} as any;
		});

		const result = await installBrew();
		expect(result).toBe('Brew already installed');
		expect(mockedExec).toHaveBeenCalledTimes(1);
		expect(mockedExec).toHaveBeenCalledWith(
			'command -v brew',
			expect.any(Function)
		);
	});

	it('should install brew successfully when brew is not installed', async () => {
		// Mock exec to first return error (brew not found), then success (brew installed)
		mockedExec
			.mockImplementationOnce((command, callback: any) => {
				callback(new Error('brew not found'), '', '');
				return {} as any;
			})
			.mockImplementationOnce((command, callback: any) => {
				callback(null, 'Homebrew installed successfully', '');
				return {} as any;
			});

		const result = await installBrew();
		expect(result).toBe('Homebrew installed successfully');
		expect(mockedExec).toHaveBeenCalledTimes(2);
		expect(console.log).toHaveBeenCalledWith('Installing brew...');
	});

	it('should reject when installation fails', async () => {
		// Mock exec to simulate installation failure
		mockedExec
			.mockImplementationOnce((command, callback: any) => {
				callback(new Error('brew not found'), '', '');
				return {} as any;
			})
			.mockImplementationOnce((command, callback: any) => {
				callback(new Error('Installation failed'), '', '');
				return {} as any;
			});

		await expect(installBrew()).rejects.toMatch(/error: Installation failed/);
		expect(mockedExec).toHaveBeenCalledTimes(2);
	});

	it('should reject when installation produces stderr', async () => {
		// Mock exec to simulate stderr during installation
		mockedExec
			.mockImplementationOnce((command, callback: any) => {
				callback(new Error('brew not found'), '', '');
				return {} as any;
			})
			.mockImplementationOnce((command, callback: any) => {
				callback(null, '', 'Permission denied');
				return {} as any;
			});

		await expect(installBrew()).rejects.toMatch(/stderr: Permission denied/);
		expect(mockedExec).toHaveBeenCalledTimes(2);
	});
});
