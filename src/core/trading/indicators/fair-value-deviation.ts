import { sd, mean, fix } from '@utils/math';
import { Bar } from '@core/trading/primitives';

function fairValueDeviation(bars: Array<Bar>, period = 1200): Array<TimelineIndicatorPoint> {
	const points: Array<TimelineIndicatorPoint> = [];
	if (bars.length <= period) return points;
	const values = bars.map(x => x.getClose());

	for (let i = period; i < values.length; i++) {
		const idx = i - period;
		const sliding = values.slice(idx, i);
		const average = mean(sliding);
		const stdev = sd(sliding);
		const fairValue = average + stdev;
		const point: TimelineIndicatorPoint = {
			value: fix((values[i] / fairValue) * 100, 2),
			time: bars[i].getTimestamp(),
		};

		points.push(point);
	}

	return points;
}

type TimelineIndicatorPoint = {
	value: number;
	time: number;
};

export { fairValueDeviation };
