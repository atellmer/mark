import { random } from '@utils/math';
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

		while (selectedSamples.length < samples.length) {
			const rnd = random(0, 100);

			for (let i = 0; i < wheel.length - 1; i++) {
				if (rnd <= wheel[i] || rnd > wheel[i + 1]) {
					continue;
				}
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
}

type Weight = {
	value: number;
	index: number;
};

export { ProbabilitySelector };
