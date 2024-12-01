import { checkVirtualDevices } from '../../check/checkVirtualDevice.js';
import { exec } from 'child_process';

// Mock child_process.exec
jest.mock('child_process');
const mockedExec = exec as jest.MockedFunction<typeof exec>;

describe('checkVirtualDevices', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Mock console.error to prevent output during tests
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		// Restore console.error after each test
		jest.restoreAllMocks();
	});

	it('should return android and ios devices when both commands succeed', async () => {
		// Mock successful responses
		mockedExec.mockImplementation((command: string, callback: any) => {
			if (command === 'emulator -list-avds') {
				callback(null, 'Pixel_4_API_30\nPixel_5_API_31', '');
			} else if (command === 'xcrun simctl list devices') {
				callback(
					null,
					'iPhone 13 (Shutdown)\niPhone 14 Pro (Booted)\niPad Pro (Active)',
					''
				);
			}
			return {} as any;
		});

		const result = await checkVirtualDevices();

		expect(result).toEqual({
			androidDevices: ['Pixel_4_API_30', 'Pixel_5_API_31'],
			iosDevices: ['iPhone 13 (Shutdown)', 'iPhone 14 Pro (Booted)'],
		});
		expect(mockedExec).toHaveBeenCalledTimes(2);
	});

	it('should handle empty device lists', async () => {
		mockedExec.mockImplementation((command: string, callback: any) => {
			callback(null, '', '');
			return {} as any;
		});

		const result = await checkVirtualDevices();

		expect(result).toEqual({
			androidDevices: [],
			iosDevices: [],
		});
	});

	it('should handle android command failure and log error', async () => {
		const consoleErrorSpy = jest.spyOn(console, 'error');
		mockedExec.mockImplementation((command: string, callback: any) => {
			if (command === 'emulator -list-avds') {
				callback(new Error('Android SDK not found'), '', '');
			} else {
				callback(null, 'iPhone 13 (Shutdown)', '');
			}
			return {} as any;
		});

		const result = await checkVirtualDevices();

		expect(result).toEqual({
			androidDevices: [],
			iosDevices: [],
		});
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'error: Android SDK not found'
		);
	});

	it('should handle ios command failure and log error', async () => {
		const consoleErrorSpy = jest.spyOn(console, 'error');
		mockedExec.mockImplementation((command: string, callback: any) => {
			if (command === 'xcrun simctl list devices') {
				callback(null, '', 'xcrun: error: unable to find simctl');
			} else {
				callback(null, 'Pixel_4_API_30', '');
			}
			return {} as any;
		});

		const result = await checkVirtualDevices();

		expect(result).toEqual({
			androidDevices: [],
			iosDevices: [],
		});
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'stderr: xcrun: error: unable to find simctl'
		);
	});
});
