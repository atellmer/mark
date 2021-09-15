import { mean } from '@utils/math';

function sma(values: Array<number>, period: number) {
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

export { sma };
