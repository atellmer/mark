export type PluralOptions = {
	count: number;
	titles: [string, string, string];
	lang?: 'ru';
};

// [single, few, many]
function plural(options: PluralOptions) {
	const { count, titles } = options;
	const cases = [2, 0, 1, 1, 1, 2];

	return titles[count % 100 > 4 && count % 100 < 20 ? 2 : cases[count % 10 < 5 ? count % 10 : 5]];
}

export { plural };
