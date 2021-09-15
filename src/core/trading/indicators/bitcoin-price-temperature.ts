import { sd, mean, fix } from '@utils/math';
import { Bar } from '@core/trading/primitives';

function bitcoinPriceTemperature(bars: Array<Bar>) {
	const temperatures: Array<PriceTemperature> = [];
	if (bars.length <= FOUR_YEAR_CYCLE_DAYS) return temperatures;
	const values = bars.map(x => (x.getHight() + x.getLow()) / 2);

	for (let i = FOUR_YEAR_CYCLE_DAYS; i < values.length; i++) {
		const idx = i - FOUR_YEAR_CYCLE_DAYS;
		const sliding = values.slice(idx, i);
		const average = mean(sliding);
		const stdev = sd(sliding);
		const t: PriceTemperature = {
			value: fix((values[i] - average) / stdev, 2),
			time: bars[i].getTimestamp(),
		};

		temperatures.push(t);
	}

	return temperatures;
}

type PriceTemperature = {
	value: number;
	time: number;
};

const FOUR_YEAR_CYCLE_DAYS = 1460;

export { bitcoinPriceTemperature };
