import { getTimestamp } from '@utils/date';
import { Bar } from '@core/trading/primitives';

function extractTickerFromPair(pair: string): string {
	const [ticker] = pair.split('_');

	return ticker;
}

function filterBars(bars: Array<Bar>, dateRange: DateRange) {
	const start = getTimestamp(dateRange.dateStart);
	const end = getTimestamp(dateRange.dateEnd);
	const filteredBars = bars.filter(x => x.getTimestamp() >= start && x.getTimestamp() <= end);

	return filteredBars;
}

export { extractTickerFromPair, filterBars };
