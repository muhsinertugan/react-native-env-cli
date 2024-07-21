//TODO: MOVE THIS TYPE

import { ToolGroups, ToolsType } from '../types/toolTypes.js';

const TOOL_GROUPS: ToolGroups = {
	Binaries: 'Binaries',
	Managers: 'Managers',
	Languages: 'Languages',
	IDEs: 'IDEs',
};

const TOOLS: ToolsType<ToolGroups> = {
	[TOOL_GROUPS.Binaries]: {
		npm: {
			command: 'npm',
			versionRange: '>= 4.x',
		},
		Node: {
			command: 'node',
			versionRange: '>= 18',
		},
		Yarn: {
			command: 'yarn',
			versionRange: '>= 1.10.x',
		},
		bun: {
			command: 'bun',
			versionRange: '>= 1.0.0',
		},
		Watchman: {
			command: 'watchman',
			versionRange: '',
		},
	},
	[TOOL_GROUPS.Managers]: {
		Homebrew: {
			command: 'brew',
			versionRange: '>= 4.2.20',
		},
		RubyGems: {
			command: 'gem',
			versionRange: '>= 3.5.4',
		},
		CocoaPods: {
			command: 'pod',
			versionRange: '>= 1.10.0',
		},
	},
	[TOOL_GROUPS.Languages]: {
		Ruby: {
			command: 'ruby',
			versionRange: '>= 2.6.10',
		},
		Java: {
			command: 'java',
			versionRange: '>= 17 <= 20',
		},
	},

	//might not need ides look for sdks and ndks
	[TOOL_GROUPS.IDEs]: {
		Xcode: {
			command: 'xcodebuild',
			versionRange: '>= 15.x',
		},
		'Android Studio': {
			command: 'studio',
			versionRange: '2023.2',
		},
	},
	// ANDROID_SDK: 'ANDROID_SDK',
	// ANDROID_NDK: 'ANDROID_NDK',
};

// const VERSION_RANGE = {
// 	Binaries: {
// 		[TOOLS.Binaries.npm.name]: '>= 4.x',
// 		[TOOLS.Binaries.Node.name]: '>= 18',
// 		[TOOLS.Binaries.Yarn.name]: '>= 1.10.x',
// 		[TOOLS.Binaries.bun.name]: '>= 1.0.0',
// 		[TOOLS.Binaries.Watchman.name]: '>= 2024.01.22.00',
// 	},
// 	Managers: {
// 		[TOOLS.Managers.Homebrew.name]: '>= 4.2.20',
// 		[TOOLS.Managers.RubyGems.name]: '>= 3.5.4',
// 		[TOOLS.Managers.CocoaPods.name]: '>= 1.10.0',
// 	},
// 	Languages: {
// 		[TOOLS.Languages.Java.name]: '>= 17 <= 20',
// 		[TOOLS.Languages.Ruby.name]: '>= 2.6.10',
// 	},
// 	IDEs: {
// 		[TOOLS.IDEs.Xcode.name]: '>= 12.x',
// 		[TOOLS.IDEs['Android Studio'].name]: '',
// 	},
// 	// [TOOLS.ANDROID_SDK]: '>= 33.x',
// 	// [TOOLS.ANDROID_NDK]: '>= 23.x',
// } as const;

export { TOOLS, TOOL_GROUPS };
