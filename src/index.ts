#!/usr/bin/env node

import { Command } from 'commander';
import { checkEnvVariables } from './check/checkEnvVariables.js';
import { checkVersion } from './check/checkVersion.js';

//declere the program

const program = new Command();

//Add actions to CLI

program
	.name('setup-env')
	.description('CLI for setting up the initial env for React Native Projects')
	.version('0.0.1')
	.action(async () => {
		const versions = await checkVersion();
		const envVariables = checkEnvVariables();

		console.log('envVariables', envVariables);

		console.log(versions);
	});

// Execute the CLI

program.parse(process.argv);


