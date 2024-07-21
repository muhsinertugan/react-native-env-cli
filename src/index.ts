#!/usr/bin/env node

import { Command } from 'commander';
import { TOOL_GROUPS } from './constants/index.js';
import { checkVersion } from './check/checkVersion.js';
import { ToolGroups } from './types/toolTypes.js';

//declere the program

const program = new Command();

//Add actions to CLI

program
	.name('setup-env')
	.description('CLI for setting up the initial env for React Native Projects')
	.version('0.0.1')
	.action(async () => {
		const versions = await checkVersion();
		console.log(versions);
	});

// Execute the CLI

program.parse(process.argv);


