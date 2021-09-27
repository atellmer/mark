import moment from 'moment';

import { BASE_TIME_FORMAT } from '@utils/date';
import { fix } from '@utils/math';
import { Bar } from '@core/trading/primitives';
import { sma } from './moving-average';

type TimelineIndicatorPoint = {
	value: number;
	time: number;
};

function bitcoinCycleHarmony(bars: Array<Bar>) {
	const values: Array<TimelineIndicatorPoint> = [];
	const prices = bars.map(x => (x.getHight() + x.getLow()) / 2);
	const slowMoving = sma(prices, SLOW_PERIOD);
	const fastMovingBuffer = sma(prices, FAST_PERIOD);
	const fastMoving = fastMovingBuffer.slice(fastMovingBuffer.length - slowMoving.length);
	const startIdx = prices.length - slowMoving.length;

	for (let i = startIdx; i < prices.length; i++) {
		const time = bars[i].getTimestamp();
		const idx = i - startIdx;
		const t: TimelineIndicatorPoint = {
			value: fix(fastMoving[idx] / slowMoving[idx], 6),
			time,
			//t: bars[i].getTime()
		};

		values.push(t);
	}

	const timeA = moment('01-01-2013', BASE_TIME_FORMAT).unix();
	const timeB = moment('01-01-2024', BASE_TIME_FORMAT).unix();

	const positiveTrendline: Array<TimelineIndicatorPoint> = [
		{
			time: timeA,
			value: fix(calculatePositiveTrendline(timeA), 6),
		},
		{
			time: timeB,
			value: fix(calculatePositiveTrendline(timeB), 6),
		},
	];

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

	return {
		values,
		positiveTrendline,
		topTrendline,
		bottomTrendline,
	};
}

function calculatePositiveTrendline(x: number) {
	const x1 = 1396479600;
	const y1 = 1.951353;
	const x2 = 1526601600;
	const y2 = 1.819714;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

function calculateTopTrendline(x: number) {
	const x1 = 1385679600;
	const y1 = 1.873369;
	const x2 = 1513382400;
	const y2 = 1.741424;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

function calculateBottomTrendline(x: number) {
	const x1 = 1421193600;
	const y1 = 1.783295;
	const x2 = 1544832000;
	const y2 = 1.68355;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

const FAST_PERIOD = 450;
const SLOW_PERIOD = 900;

export { bitcoinCycleHarmony };
