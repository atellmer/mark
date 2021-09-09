import { random, min } from '@utils/math';
import { Sample } from '../sample';
import { Answer } from './models';

class ProbabilitySelector {
	public static select(factors: Array<number>, samples: Array<Sample>): Array<Sample> {
		const size = samples.length;
		const weights: Array<Weight> = factors.map((x, idx) => ({ value: x, index: idx }));
		const selectedSamples: Array<Sample> = [];
		let positiveAnswersCount = 0;
		let negativeAnswersCount = 0;
		let selectedPositiveAnswersCount = 0;
		let selectedNegativeAnswersCount = 0;

		for (let i = 0; i < size; i++) {
			const answer = samples[i].getAnswer();

			if (answer === Answer.POSITIVE) {
				positiveAnswersCount++;
			} else {
				negativeAnswersCount++;
			}
		}

		weights.sort((a, b) => a.value - b.value);

		const wheel = ProbabilitySelector.whell(size, weights);

		while (selectedSamples.length < wheel.length) {
			const minSize = min(wheel);
			const rnd = ProbabilitySelector.random(minSize);

			for (let i = 0; i < wheel.length - 1; i++) {
				if (rnd > wheel[i] && rnd <= wheel[i + 1]) {
					const sample = samples[weights[i + 1].index];
					const answer = sample.getAnswer();

					if (answer === Answer.POSITIVE && selectedPositiveAnswersCount < positiveAnswersCount) {
						selectedSamples.push(sample);
						selectedPositiveAnswersCount++;
					} else if (answer === Answer.NEGATIVE && selectedNegativeAnswersCount < negativeAnswersCount) {
						selectedSamples.push(sample);
						selectedNegativeAnswersCount++;
					}
				}
			}
		}

		return selectedSamples;
	}

	private static whell(size: number, weights: Array<Weight>): Array<number> {
		const wheel: Array<number> = [];
		let sector = 0;
		let index = 0;

		for (let i = 3; i < size + 3; i++) {
			sector = 0;

			for (let j = 0; j < i - 2; j++) {
				sector += weights[j].value;
			}

			wheel[index] = sector * 100;
			index++;
		}

		return wheel;
	}

	private static random(minSize: number): number {
		if (minSize >= 1) {
			return random(0, 100);
		}

		if (minSize < 1 && minSize >= 0.1) {
			return random(0, 1000) * 0.1;
		}

		if (minSize < 0.1 && minSize >= 0.01) {
			return random(0, 10000) * 0.01;
		}

		if (minSize < 0.01 && minSize >= 0.001) {
			return random(0, 100000) * 0.001;
		}

		if (minSize < 0.001 && minSize >= 0.0001) {
			return random(0, 1000000) * 0.0001;
		}

		if (minSize < 0.0001 && minSize >= 0.00001) {
			return random(0, 10000000) * 0.00001;
		}

		if (minSize < 0.00001 && minSize >= 0.000001) {
			return random(0, 100000000) * 0.000001;
		}

		if (minSize < 0.000001) {
			return random(0, 1000000000) * 0.0000001;
		}

		return 0.0;
	}
}

type Weight = {
	value: number;
	index: number;
};

export { ProbabilitySelector };
