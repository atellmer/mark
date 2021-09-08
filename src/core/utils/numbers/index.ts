function safeNumber(source: string | number, precision = 2): number {
	return Number(Number(source).toFixed(precision));
}

type FormatNumber = {
	fractions?: number;
	locale?: string;
};

function formatNumber(value: number, options: FormatNumber = {}) {
	const { fractions = 2, locale = 'ru' } = options;

	return new Intl.NumberFormat(locale, {
		style: 'decimal',
		minimumFractionDigits: fractions,
		maximumFractionDigits: fractions,
	}).format(value);
}

export { safeNumber, formatNumber };
