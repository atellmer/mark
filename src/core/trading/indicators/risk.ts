import regression from 'regression';

import { fix, minimax, mean, sd } from '@utils/math';
import { Bar } from '@core/trading/primitives';

type TimelineIndicatorPoint = {
	value: number;
	time: number;
};

function risk(bars: Array<Bar>) {
	const values: Array<TimelineIndicatorPoint> = [];
	const band: Array<TimelineIndicatorPoint> = [];
	const prices = bars.map(x => x.getClose());
	const startIdx = SLIDING_PERIOD;
	const data: Array<number> = [];
	let source: Array<number> = [];

	for (let i = startIdx; i < prices.length; i++) {
		const idx = i - startIdx;
		const sliding = prices.slice(idx, i);
		const average = mean(sliding);
		const stdev = sd(sliding);
		const x = fix(Math.log(prices[i] / (average + stdev)), 4);

		data.push(x);
	}

	const predictor = regression.logarithmic([
		[1385679600, 2.1512],
		[1512604800, 1.7455],
	]);

	for (let i = startIdx; i < prices.length; i++) {
		const time = bars[i].getTimestamp();
		const point: TimelineIndicatorPoint = {
			value: predictor.predict(time)[1],
			time,
		};

		band.push(point);
	}

	for (let i = startIdx; i < prices.length; i++) {
		const idx = i - startIdx;
		const x = fix((data[idx] / band[idx].value) * 100, 4);

		source.push(x);
	}

	source = minimax(source, [0, 1]);

	for (let i = startIdx; i < prices.length; i++) {
		const time = bars[i].getTimestamp();
		const idx = i - startIdx;
		const x = source[idx];
		const point: TimelineIndicatorPoint = {
			value: x,
			time,
		};

		values.push(point);
	}

	return {
		values,
		band,
	};
}

const SLIDING_PERIOD = 1200;

export { risk };
