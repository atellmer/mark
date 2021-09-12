function extractTickerFromPair(pair: string): string {
	const [ticker] = pair.split('_');

	return ticker;
}

export { extractTickerFromPair };
