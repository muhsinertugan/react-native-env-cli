type ToolGroups = {
	Binaries: 'Binaries';
	Managers: 'Managers';
	Languages: 'Languages';
	IDEs: 'IDEs';
};

type ToolsType<ToolGroups> = {
	[Property in keyof ToolGroups]: Record<
		string,
		Record<'name' | 'command' | 'versionRange', string>
	>;
};

export type { ToolGroups, ToolsType };
