#!/usr/bin/env node

import { Command } from 'commander';
import { checkEnvVariables } from './check/checkEnvVariables.js';
import { checkVersion } from './check/checkVersion.js';
import inquirer from 'inquirer';
import { checkVirtualDevices } from './check/checkVirtualDevice.js';
import { checkBrew } from './check/checkBrew.js';
import chalk from 'chalk';
import { installBrew } from './install/installBrew.js';
import { installTool } from './install/installTool.js';
import { installVirtualDevice } from './install/installVirtualDevice.js';
import { TOOLS } from './constants/index.js';
import type {
	CheckResults,
	PromptResults,
	ToolDefinition,
} from './types/cliTypes.js';

// Declare the program
const program = new Command();

// Add actions to CLI
program
	.name('setup-env')
	.description('CLI for setting up the initial env for React Native Projects')
	.version('0.0.1')
	.action(async () => {
		try {
			// Add signal handling at the start of the action
			process.on('SIGINT', () => {
				console.log(chalk.yellow('\nSetup cancelled by user'));
				process.exit(0);
			});

			console.log(chalk.green('Welcome to the setup-env CLI!'));

			let checksToRun: string[] = [];
			try {
				const result = await inquirer.prompt<
					Pick<PromptResults, 'checksToRun'>
				>([
					{
						type: 'checkbox',
						name: 'checksToRun',
						message: 'Select which checks to perform:',
						choices: [
							{ name: 'Version Check', value: 'version', checked: true },
							{ name: 'Environment Variables', value: 'env', checked: true },
							{ name: 'Virtual Devices', value: 'devices', checked: true },
							{ name: 'Homebrew', value: 'brew', checked: true },
						],
					},
				]);
				checksToRun = result.checksToRun;
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes('User force closed')
				) {
					console.log(chalk.yellow('\nSetup cancelled by user'));
					process.exit(0);
				}
				throw error;
			}

			const CHECK_CONFIG = {
				version: {
					label: 'Checking versions...',
					color: 'blue',
					check: checkVersion,
					formatResult: (result: Record<string, boolean>) => {
						return Object.entries(result)
							.map(([tool, installed]) => `${tool}: ${installed ? '✅' : '❌'}`)
							.join('\n');
					},
				},
				env: {
					label: 'Checking environment variables...',
					color: 'yellow',
					check: checkEnvVariables,
					formatResult: (result: Record<string, any>) => {
						return Object.entries(result)
							.map(
								([group, vars]) =>
									`${group}:\n${Object.entries(vars)
										.map(([key, value]) => `  ${key}: ${value ? '✅' : '❌'}`)
										.join('\n')}`
							)
							.join('\n');
					},
				},
				devices: {
					label: 'Checking virtual devices...',
					color: 'magenta',
					check: checkVirtualDevices,
					formatResult: (result: {
						androidDevices: string[];
						iosDevices: string[];
					}) => {
						const androidCount = result.androidDevices.length;
						const iosCount = result.iosDevices.length;
						return (
							`Android Devices: ${
								androidCount ? '✅' : '❌'
							} (${androidCount} found)\n` +
							`iOS Devices: ${iosCount ? '✅' : '❌'} (${iosCount} found)`
						);
					},
				},
				brew: {
					label: 'Checking brew...',
					color: 'cyan',
					check: checkBrew,
					formatResult: (result: boolean) => (result ? '✅' : '❌'),
				},
			} as const;

			type CheckType = keyof typeof CHECK_CONFIG;
			type CheckResult =
				| boolean
				| { androidDevices: any[] }
				| Record<string, boolean>;

			const results: Record<CheckType, CheckResult> = {
				version: false,
				env: false,
				devices: { androidDevices: [] },
				brew: false,
			};

			// Run selected checks
			for (const check of checksToRun) {
				try {
					const config = CHECK_CONFIG[check as CheckType];
					console.log(chalk[config.color](config.label));
					results[check as CheckType] = await config.check();
					console.log(
						chalk[config.color](check + ':'),
						config.formatResult
							? config.formatResult(results[check as CheckType] as any)
							: results[check as CheckType]
					);
				} catch (error) {
					console.error(chalk.red(`Error during ${check} check:`), error);
				}
			}

			// After running the checks, add this function
			const hasMissingRequirements = (
				results: Record<CheckType, CheckResult>
			): boolean => {
				// Check versions
				if (results.version && typeof results.version === 'object') {
					const versionResults = results.version as Record<string, boolean>;
					if (Object.values(versionResults).every((v) => v === true)) {
						return false; // All versions are installed, no missing requirements
					}
					return Object.values(versionResults).some((v) => v === false);
				}

				// Check env variables
				if (results.env && typeof results.env === 'object') {
					const envResults = results.env as Record<
						string,
						boolean | Record<string, boolean>
					>;
					// Only return true if there are actual false values
					return Object.entries(envResults).some(([_, value]) => {
						if (typeof value === 'boolean') return !value;
						return Object.values(value).some((v) => !v);
					});
				}

				// Check devices
				if (results.devices) {
					if (
						typeof results.devices === 'object' &&
						'androidDevices' in results.devices &&
						'iosDevices' in results.devices
					) {
						const hasAndroidDevices =
							Array.isArray(results.devices.androidDevices) &&
							results.devices.androidDevices.length > 0;
						const hasIosDevices =
							Array.isArray(results.devices.iosDevices) &&
							results.devices.iosDevices.length > 0;

						// Only return true if BOTH platforms have no devices
						return !hasAndroidDevices && !hasIosDevices;
					}
				}

				// Check brew
				if (typeof results.brew === 'boolean' && !results.brew) {
					return true;
				}

				return false;
			};

			// Then modify the installation prompt section (lines 131-179):
			if (checksToRun.length > 0 && hasMissingRequirements(results)) {
				const { install } = await inquirer.prompt([
					{
						type: 'confirm',
						name: 'install',
						message:
							'Some requirements are missing. Do you want to install them?',
						default: true,
					},
				]);

				if (install) {
					console.log(chalk.green('Installing missing requirements...'));
					if (results.brew === false) {
						await installBrew();
					}

					if (results.version) {
						for (const [tool, isInstalled] of Object.entries(
							results.version as Record<string, boolean>
						)) {
							if (!isInstalled) {
								const toolConfig = Object.values(TOOLS)
									.flatMap((group) => Object.values(group))
									.find(
										(t) =>
											t.name === tool && 'command' in t && 'versionRange' in t
									);
								if (toolConfig?.brewCommand) {
									await installTool(toolConfig);
								}
							}
						}
					}

					if (
						typeof results.devices === 'object' &&
						'androidDevices' in results.devices &&
						Array.isArray(results.devices.androidDevices) &&
						results.devices.androidDevices.length === 0
					) {
						await installVirtualDevice();
					}

					console.log(chalk.green('Installation completed.'));
				} else {
					console.log(chalk.yellow('Installation skipped.'));
				}
			} else {
				console.log(chalk.green('All requirements are satisfied!'));
			}

			console.log(chalk.green('Setup completed successfully.'));
		} catch (error) {
			console.error(chalk.red('An error occurred:'), error);
		}
	});

// Execute the CLI
program.parse(process.argv);
