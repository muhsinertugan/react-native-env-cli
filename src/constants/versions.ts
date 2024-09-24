import { ToolsType } from '../types/toolTypes.js';

const TOOL_GROUPS = {
	Binaries: 'Binaries',
	Managers: 'Managers',
	Languages: 'Languages',
	IDEs: 'IDEs',
} as const;

const TOOLS: ToolsType = {
	[TOOL_GROUPS.Binaries]: {
		npm: {
			name: 'npm',
			command: 'npm',
			versionRange: '>= 4.x',
		},
		Node: {
			name: 'Node',
			brewCommand: 'node',
			command: 'node',
			versionRange: '>= 18',
		},
		Yarn: {
			name: 'Yarn',
			brewCommand: 'yarn',
			command: 'yarn',
			versionRange: '>= 1.10.x',
		},
		bun: {
			name: 'bun',
			command: 'bun',
			versionRange: '>= 1.0.0',
		},
		Watchman: {
			name: 'Watchman',
			brewCommand: 'watchman',
			command: 'watchman',
			versionRange: '',
		},
	},
	[TOOL_GROUPS.Managers]: {
		Homebrew: {
			name: 'Homebrew',
			command: 'brew',
			versionRange: '>= 4.2.20',
		},
		RubyGems: {
			name: 'RubyGems',
			brewCommand: 'brew-gem',
			command: 'gem',
			versionRange: '>= 3.5.4',
		},
		CocoaPods: {
			name: 'CocoaPods',
			brewCommand: 'cocoapods',
			command: 'pod',
			versionRange: '>= 1.10.0',
		},
	},
	[TOOL_GROUPS.Languages]: {
		Ruby: {
			name: 'Ruby',
			brewCommand: 'ruby',
			command: 'ruby',
			versionRange: '>= 2.6.10',
		},
		Java: {
			name: 'Java',
			brewCommand: 'openjdk',
			command: 'java',
			versionRange: '>= 17 <= 20',
		},
	},

	//might not need ides look for sdks and ndks
	[TOOL_GROUPS.IDEs]: {
		Xcode: {
			name: 'Xcode',
			command: 'xcodebuild',
			versionRange: '>= 15.4.x',
		},
		'Android Studio': {
			name: 'Android Studio',
			command: 'studio',
			versionRange: '2023.2',
		},
	},
};

export { TOOL_GROUPS, TOOLS };
