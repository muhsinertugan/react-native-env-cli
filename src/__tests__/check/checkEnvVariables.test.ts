// At the top of the file, before any imports
const mockENV_VARIABLES = {
	group1: {
		subgroup: {
			SOME_ENV_VAR: { path: '~/expected/path' },
			MISSING_VAR: { path: '~/some/path' },
			ABSOLUTE_PATH_VAR: { path: '/absolute/path' },
			TEST_VAR: { path: '~/some/path' },
		},
	},
};

jest.doMock('../../constants/index.js', () => ({
	ENV_VARIABLES: mockENV_VARIABLES,
}));

import { checkEnvVariables } from '../../check/checkEnvVariables.js';

describe('checkEnvVariables', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset process.env before each test
		process.env = { ...originalEnv };
		process.env.HOME = '/home/user';

		// Clear all mocks before each test
		jest.resetModules();
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Restore original process.env after each test
		process.env = originalEnv;
	});

	it('should correctly validate matching paths', () => {
		process.env.SOME_ENV_VAR = '/home/user/expected/path';

		const result = checkEnvVariables();

		expect(result.group1.subgroup.SOME_ENV_VAR).toEqual({
			isValid: true,
			value: '/home/user/expected/path',
			expectedPath: '/home/user/expected/path',
		});
	});

	it('should handle missing environment variables', () => {
		// Set mock implementation for this test
		jest.doMock('../../constants/index.js', () => ({
			ENV_VARIABLES: {
				group1: {
					subgroup: {
						MISSING_VAR: {
							path: '~/some/path',
						},
					},
				},
			},
		}));

		const result = checkEnvVariables();

		expect(result.group1.subgroup.MISSING_VAR).toEqual({
			isValid: false,
			value: null,
			expectedPath: '/home/user/some/path',
		});
	});

	it('should handle absolute paths', () => {
		process.env.ABSOLUTE_PATH_VAR = '/absolute/path';

		// Set mock implementation for this test
		jest.requireMock('../../constants/index.js').ENV_VARIABLES = {
			group1: {
				subgroup: {
					ABSOLUTE_PATH_VAR: {
						path: '/absolute/path',
					},
				},
			},
		};

		const result = checkEnvVariables();

		expect(result.group1.subgroup.ABSOLUTE_PATH_VAR).toEqual({
			isValid: true,
			value: '/absolute/path',
			expectedPath: '/absolute/path',
		});
	});

	it('should handle missing HOME environment variable', () => {
		delete process.env.HOME;
		process.env.TEST_VAR = '/some/path';

		const result = checkEnvVariables();

		expect(result.group1.subgroup.TEST_VAR).toEqual({
			isValid: true,
			value: '/some/path',
			expectedPath: '/some/path',
		});
	});
});
