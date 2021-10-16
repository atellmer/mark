import moment from 'moment';

import { BASE_TIME_FORMAT } from '@utils/date';

import { sd, mean, fix } from '@utils/math';
import { Bar } from '@core/trading/primitives';

function fairValueDeviation(bars: Array<Bar>, period = 1200): IndicatorValue {
	const deviations: Array<TimelineIndicatorPoint> = [];
	if (bars.length <= period) return null;
	const values = bars.map(x => x.getClose());

	for (let i = period; i < values.length; i++) {
		const time = bars[i].getTimestamp();
		const idx = i - period;
		const sliding = values.slice(idx, i);
		const average = mean(sliding);
		const stdev = sd(sliding);
		const fairValue = average + stdev;
		const point: TimelineIndicatorPoint = {
			value: fix((values[i] / fairValue) * 100, 2),
			time,
		};

		deviations.push(point);
	}

	const timeA = moment('29-10-2013', BASE_TIME_FORMAT).unix();
	const timeB = moment('01-01-2024', BASE_TIME_FORMAT).unix();

	const topTrendline: Array<TimelineIndicatorPoint> = [
		{
			time: timeA,
			value: fix(calculateTopTrendline(timeA), 6),
		},
		{
			time: timeB,
			value: fix(calculateTopTrendline(timeB), 6),
		},
	];

	const bottomTrendline: Array<TimelineIndicatorPoint> = [
		{
			time: timeA,
			value: fix(calculateBottomTrendline(timeA), 6),
		},
		{
			time: timeB,
			value: fix(calculateBottomTrendline(timeB), 6),
		},
	];

	const value: IndicatorValue = {
		deviations,
		topTrendline,
		bottomTrendline,
	};

	return value;
}

function calculateTopTrendline(x: number) {
	const x1 = 1385593200;
	const y1 = 859.55;
	const x2 = 1512604800;
	const y2 = 572.92;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

function calculateBottomTrendline(x: number) {
	const x1 = 1421193600;
	const y1 = 32.96; // 50
	const x2 = 1544745600;
	const y2 = 42.9; // 50
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

type TimelineIndicatorPoint = {
	value: number;
	time: number;
};

type IndicatorValue = {
	deviations: Array<TimelineIndicatorPoint>;
	topTrendline: Array<TimelineIndicatorPoint>;
	bottomTrendline: Array<TimelineIndicatorPoint>;
};

export { fairValueDeviation };
