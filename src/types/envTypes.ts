type EnvGroups = {
	SDKs: 'SDKs';
};

type EnvCategoriesList = {
	Android_SDK: 'Android_SDK';
};

type EnvTypes = {
	[Property in keyof EnvGroups]: {
		[Property in keyof EnvCategoriesList]: Record<
			string,
			Record<'path', string>
		>;
	};
};

export { type EnvTypes, type EnvCategoriesList, type EnvGroups };
