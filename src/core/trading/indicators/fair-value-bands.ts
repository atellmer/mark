import { sd, mean, fix } from '@utils/math';
import { Bar } from '@core/trading/primitives';

function fairValueBands(bars: Array<Bar>, period = 1200): IndicatorValue {
	const pricePoints: Array<TimelineIndicatorPoint> = [];
	const middleBandPoints: Array<TimelineIndicatorPoint> = [];
	const topBandPoints: Array<TimelineIndicatorPoint> = [];
	const bottomBandPoints: Array<TimelineIndicatorPoint> = [];
	if (bars.length <= period) return null;
	const values = bars.map(x => x.getClose());

	for (let i = period; i < values.length; i++) {
		const time = bars[i].getTimestamp();
		const idx = i - period;
		const sliding = values.slice(idx, i);
		const average = mean(sliding);
		const stdev = sd(sliding);
		const fairValue = average + stdev;
		const pricePoint: TimelineIndicatorPoint = {
			value: fix(values[i], 2),
			time,
		};
		const topBandPoint: TimelineIndicatorPoint = {
			value: fix((fairValue * maxTopDeviationPercent(time)) / 100, 2),
			time,
		};
		const middleBandPoint: TimelineIndicatorPoint = {
			value: fix(fairValue, 2),
			time,
		};
		const bottomBandPoint: TimelineIndicatorPoint = {
			value: fix((fairValue * maxBottomDeviationPercent(time)) / 100, 2),
			time,
		};

		pricePoints.push(pricePoint);
		topBandPoints.push(topBandPoint);
		middleBandPoints.push(middleBandPoint);
		bottomBandPoints.push(bottomBandPoint);
	}

	const value: IndicatorValue = {
		pricePoints,
		topBandPoints,
		middleBandPoints,
		bottomBandPoints,
	};

	return value;
}

function maxTopDeviationPercent(x: number) {
	const x1 = 1385593200;
	const y1 = 859.55;
	const x2 = 1512604800;
	const y2 = 572.92;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

function maxBottomDeviationPercent(x: number) {
	const x1 = 1421193600;
	const y1 = 32.96;
	const x2 = 1544745600;
	const y2 = 42.9;
	const y = (y2 - y1) * ((x - x1) / (x2 - x1)) + y1;

	return y;
}

type IndicatorValue = {
	pricePoints: Array<TimelineIndicatorPoint>;
	middleBandPoints: Array<TimelineIndicatorPoint>;
	topBandPoints: Array<TimelineIndicatorPoint>;
	bottomBandPoints: Array<TimelineIndicatorPoint>;
};

type TimelineIndicatorPoint = {
	value: number;
	time: number;
};

export { fairValueBands };
