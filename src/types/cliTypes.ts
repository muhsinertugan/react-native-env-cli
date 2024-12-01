export interface CheckResults {
	versions?: Record<string, boolean>;
	env?: Record<string, Record<string, boolean>>;
	devices?: {
		androidDevices: string[];
		iosDevices: string[];
	};
	brew?: boolean;
}

type CheckType = 'version' | 'env' | 'devices' | 'brew';

export interface PromptResults {
	checksToRun: CheckType[];
	install: boolean;
}

export type ToolDefinition = {
	name: string;
	brewCommand: string;
	// Add any other properties your tool definition needs
};
