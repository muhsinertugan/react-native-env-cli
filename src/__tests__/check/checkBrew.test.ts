import { checkBrew } from '../../check/checkBrew.js';
import { exec } from 'child_process';

// Mock the exec function explicitly
jest.mock('child_process', () => ({
	exec: jest.fn(),
}));

describe('checkBrew', () => {
	// Use jest.MockedFunction to type the mock correctly
	const mockExec = exec as jest.MockedFunction<typeof exec>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return true if brew is installed', async () => {
		// Mock successful brew --version output
		mockExec.mockImplementation((command, optionsOrCallback, callback?) => {
			const cb =
				typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
			if (cb) cb(null, 'Homebrew 4.0.0\n', '');
			return {} as any; // Return a minimal ChildProcess mock
		});

		const result = await checkBrew();
		expect(result).toBe(true);
		expect(mockExec).toHaveBeenCalledWith(
			'brew --version',
			expect.any(Function)
		);
	});

	test('should return false if brew is not installed', async () => {
		// Mock an error when running brew --version
		mockExec.mockImplementation((command, optionsOrCallback, callback?) => {
			const cb =
				typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
			if (cb) cb(new Error('Command not found'), '', '');
			return {} as any; // Return a minimal ChildProcess mock
		});

		const result = await checkBrew();
		expect(result).toBe(false);
		expect(mockExec).toHaveBeenCalledWith(
			'brew --version',
			expect.any(Function)
		);
	});

	test('should return false if brew outputs to stderr', async () => {
		// Mock stderr output
		mockExec.mockImplementation((command, optionsOrCallback, callback?) => {
			const cb =
				typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
			if (cb) cb(null, '', 'Some error on stderr');
			return {} as any; // Return a minimal ChildProcess mock
		});

		const result = await checkBrew();
		expect(result).toBe(false);
		expect(mockExec).toHaveBeenCalledWith(
			'brew --version',
			expect.any(Function)
		);
	});
});
