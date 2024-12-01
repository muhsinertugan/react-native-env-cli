import { jest } from '@jest/globals';
import { exec } from 'child_process';
import commandExists from 'command-exists';
import { checkVersion } from '../../check/checkVersion.js';
import { getEnv } from '../../check/getEnv.js';

// Mock external dependencies
jest.mock('command-exists');
jest.mock('child_process');
jest.mock('../../check/getEnv');
jest.mock('fs', () => ({
	existsSync: jest.fn(),
}));

describe('checkVersion', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Default mock implementations
		(
			commandExists as unknown as jest.Mock<() => Promise<boolean>>
		).mockResolvedValue(true);
		(
			exec as unknown as jest.Mock<
				(cmd: string, callback: (error: Error | null) => void) => void
			>
		).mockImplementation((cmd, callback) => callback(new Error()));
		(getEnv as any).mockResolvedValue({
			IDEs: {
				Xcode: { version: '15.0/15A240d' },
			},
		});
	});

	it('should check versions for all tools', async () => {
		const results = await checkVersion();
		expect(results).toBeTruthy();
		expect(typeof results).toBe('object');
	});

	it('should handle Android Studio on macOS', async () => {
		const fs = require('fs');
		(fs.existsSync as jest.Mock).mockImplementation(
			(path) => path === '/Applications/Android Studio.app'
		);
		(
			exec as unknown as jest.Mock<
				(cmd: string, callback: (error: Error | null) => void) => void
			>
		).mockImplementation((cmd, callback) => callback(new Error()));

		const results = await checkVersion();
		expect(results['Android Studio']).toBe(true);
	});

	it('should handle Android Studio on Windows', async () => {
		const fs = require('fs');
		(fs.existsSync as jest.Mock).mockImplementation(
			(path) => path === 'C:\\Program Files\\Android\\Android Studio'
		);
		(
			exec as unknown as jest.Mock<
				(cmd: string, callback: (error: Error | null) => void) => void
			>
		).mockImplementation((cmd, callback) => callback(new Error()));

		const results = await checkVersion();
		expect(results['Android Studio']).toBe(true);
	});

	it('should handle Xcode version checking', async () => {
		(getEnv as any).mockResolvedValue({
			IDEs: {
				Xcode: { version: '15.0/15A240d' },
			},
		} as any);

		const results = await checkVersion();
		expect(results.Xcode).toBeDefined();
	});

	it('should handle missing tools', async () => {
		(
			commandExists as unknown as jest.Mock<() => Promise<boolean>>
		).mockResolvedValue(false);
		(
			exec as unknown as jest.Mock<
				(cmd: string, callback: (error: Error | null) => void) => void
			>
		).mockImplementation((cmd, callback) => callback(new Error()));
		(getEnv as any).mockResolvedValue({});

		const results = await checkVersion();
		expect(Object.values(results).every((result) => result === false)).toBe(
			true
		);
	});

	it('should handle version check errors', async () => {
		(
			commandExists as unknown as jest.Mock<() => Promise<boolean>>
		).mockRejectedValue(new Error('Command not found'));
		(
			exec as unknown as jest.Mock<
				(cmd: string, callback: (error: Error | null) => void) => void
			>
		).mockImplementation((cmd, callback) => callback(new Error()));
		(getEnv as any).mockResolvedValue({});

		const results = await checkVersion();
		expect(Object.values(results).every((result) => result === false)).toBe(
			true
		);
	});
});
