import { jest } from '@jest/globals';
import { exec } from 'child_process';
import { installTool } from '../../install/installTool.js';
import type { ToolDefinition } from '../../types/toolTypes.js';

// Mock child_process.exec
jest.mock('child_process', () => ({
	exec: jest.fn(),
}));

describe('installTool', () => {
	const mockTool: ToolDefinition = {
		name: 'test-tool',
		brewCommand: 'test-brew-package',
		command: 'test-tool',
		versionRange: '*',
	};

	beforeEach(() => {
		// Clear mock before each test
		jest.clearAllMocks();
	});

	it('should successfully install a tool', async () => {
		// Mock successful execution
		(exec as unknown as jest.Mock).mockImplementation((...args: any[]) => {
			const callback = args[1];
			callback(null, 'Tool installed successfully', '');
		});

		const result = await installTool(mockTool);

		expect(exec).toHaveBeenCalledWith(
			'brew install test-brew-package',
			expect.any(Function)
		);
		expect(result).toBe('Tool installed successfully');
	});

	it('should throw error when tool has no brew command', async () => {
		const invalidTool: ToolDefinition = {
			name: 'invalid-tool',
			brewCommand: '',
			command: 'invalid-tool',
			versionRange: '*',
		};

		await expect(installTool(invalidTool)).rejects.toThrow(
			'No brew command found for invalid-tool'
		);
	});

	it('should handle exec error', async () => {
		const mockError = new Error('Installation failed');

		(exec as unknown as jest.Mock).mockImplementation((...args: any[]) => {
			const callback = args[1];
			callback(mockError, '', '');
		});

		await expect(installTool(mockTool)).rejects.toBe(
			'error: Installation failed'
		);
	});

	it('should handle stderr output', async () => {
		(exec as unknown as jest.Mock).mockImplementation((...args: any[]) => {
			const callback = args[1];
			callback(null, '', 'stderr output');
		});

		await expect(installTool(mockTool)).rejects.toBe('stderr: stderr output');
	});
});
