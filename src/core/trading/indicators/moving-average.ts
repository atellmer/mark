import { mean } from '@utils/math';
import { TimePoint } from './models';

function sma(values: Array<number>, period: number): Array<number> {
	const points: Array<number> = [];

	for (let i = 0; i < values.length; i++) {
		const idx = i + 1 - period;

		if (idx >= 0) {
			const slice = values.slice(idx, i + 1);

			points.push(mean(slice));
		}
	}

	return points;
}

function smaTimeline(values: Array<TimePoint>, period: number): Array<TimePoint> {
	const points: Array<TimePoint> = [];

	for (let i = 0; i < values.length; i++) {
		const idx = i + 1 - period;

		if (idx >= 0) {
			const slice = values.slice(idx, i + 1);
			const time = slice[slice.length - 1].time;

			points.push({
				time: time,
				date: new Date(time),
				value: mean(slice.map(x => x.value)),
			});
		}
	}

	return points;
}

export { sma, smaTimeline };
