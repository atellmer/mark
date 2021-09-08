type FormatCurrencyOptions = {
	code?: string;
	locale?: string;
	fractions?: number;
};

function formatCurrency(value: number, options: FormatCurrencyOptions = {}): string {
	const { code = 'RUR', locale = 'ru', fractions = 2 } = options;
	const getCurrencyCode = (symbolicCode: string) => {
		const currencyUnitsByCode = {
			USD: 'USD',
			EUR: 'EUR',
			RUR: 'RUB',
			JPY: 'JPY',
			GBP: 'GBP',
		};

		return currencyUnitsByCode[symbolicCode] ? currencyUnitsByCode[symbolicCode] : currencyUnitsByCode['USD'];
	};

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: getCurrencyCode(code),
		minimumFractionDigits: fractions,
		maximumFractionDigits: fractions,
	}).format(value);
}

export { formatCurrency };
