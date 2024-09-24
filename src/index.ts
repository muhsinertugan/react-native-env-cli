#!/usr/bin/env node

import { Command } from 'commander';
import { checkEnvVariables } from './check/checkEnvVariables.js';
import { checkVersion } from './check/checkVersion.js';
import inquirer from 'inquirer';
import { checkVirtualDevices } from './check/checkVirtualDevice.js';
import { checkBrew } from './check/checkBrew.js';
import chalk from 'chalk';

// Declare the program
const program = new Command();

// Add actions to CLI
program
	.name('setup-env')
	.description('CLI for setting up the initial env for React Native Projects')
	.version('0.0.1')
	.action(async () => {
		try {
			console.log(chalk.green('Welcome to the setup-env CLI!'));

			const { proceed } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'proceed',
					message: 'Do you want to check versions?',
					default: true,
				},
			]);

			if (proceed) {
				console.log(chalk.blue('Checking versions...'));
				const versions = await checkVersion();
				console.log(chalk.blue('Versions checked:'), versions);
			}

			const { checkEnv } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'checkEnv',
					message: 'Do you want to check environment variables?',
					default: true,
				},
			]);

			if (checkEnv) {
				console.log(chalk.yellow('Checking environment variables...'));
				const envVariables = checkEnvVariables();
				console.log(chalk.yellow('Environment variables:'), envVariables);
			}

			console.log(chalk.green('Setup completed successfully.'));

			// Add checkVirtualDevices function
			const virtualDevices = await checkVirtualDevices();
			console.log(chalk.magenta('Virtual devices:'), virtualDevices);

			// Add checkBrew function
			const brew = await checkBrew();
			console.log(chalk.cyan('Brew:'), chalk.red(brew));

			const { install } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'install',
					message: 'Do you want to install the checked items?',
					default: true,
				},
			]);

			if (install) {
				console.log(chalk.green('Installing checked items...'));
				// Add your installation logic here
				console.log(chalk.green('Installation completed.'));
			} else {
				console.log(chalk.red('Installation skipped.'));
			}
		} catch (error) {
			console.error(chalk.red('An error occurred:'), error);
		}
	});

// Execute the CLI
program.parse(process.argv);
