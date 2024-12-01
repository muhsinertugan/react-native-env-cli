import { TOOL_GROUPS } from '../constants/versions.js';

type ToolGroups = (typeof TOOL_GROUPS)[keyof typeof TOOL_GROUPS];

export type ToolDefinition = {
	name: string;
	command: string;
	versionRange: string;
	brewCommand?: string;
};

type ToolsType = {
	[key in ToolGroups]: Record<string, ToolDefinition>;
};

export type { ToolGroups, ToolsType };
