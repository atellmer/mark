import { random, min } from '@utils/math';
import { Sample } from '../sample';

class ProbabilitySelector {
	public static select(weightFactors: Array<number>, samples: Array<Sample>): Array<Sample> {
		const size = samples.length;
		const weights: Array<Weight> = weightFactors.map((x, idx) => ({ value: x, index: idx }));
		const selectedSamples: Array<Sample> = [];
		let wheel: Array<number> = [];
		let count = 0;
		let positiveAnswersCount = 0;
		let negativeAnswersCount = 0;
		let selectedPositiveAnswersCount = 0;
		let selectedNegativeAnswersCount = 0;

		for (let i = 0; i < size; i++) {
			if (samples[i].getAnswer() === 1) {
				positiveAnswersCount++;
			}

			if (samples[i].getAnswer() === -1) {
				negativeAnswersCount++;
			}
		}

		weights.sort((a, b) => a.value - b.value);

		wheel = ProbabilitySelector.generateProbabilityWhell(size, weights);

		while (count < wheel.length) {
			const randomValue = ProbabilitySelector.getRandomValue(min(wheel));

			for (let i = 0; i < wheel.length - 1; i++) {
				if (randomValue > wheel[i] && randomValue <= wheel[i + 1]) {
					if (samples[weights[i + 1].index].getAnswer() == 1 && selectedPositiveAnswersCount < positiveAnswersCount) {
						selectedSamples[count] = samples[weights[i + 1].index];
						selectedPositiveAnswersCount++;
						count++;
					}

					if (samples[weights[i + 1].index].getAnswer() == -1 && selectedNegativeAnswersCount < negativeAnswersCount) {
						selectedSamples[count] = samples[weights[i + 1].index];
						selectedNegativeAnswersCount++;
						count++;
					}
				}
			}
		}

		return selectedSamples;
	}

	private static generateProbabilityWhell(sectorsCount: number, weights: Array<Weight>): Array<number> {
		let sector = 0;
		let index = 0;
		const wheel: Array<number> = [];

		for (let i = 3; i < sectorsCount + 3; i++) {
			sector = 0;

			for (let j = 0; j < i - 2; j++) {
				sector += weights[j].value;
			}

			wheel[index] = sector * 100;
			index++;
		}

		return wheel;
	}

	private static getRandomValue(minSectorSize: number): number {
		if (minSectorSize >= 1) {
			return random(0, 100);
		}

		if (minSectorSize < 1 && minSectorSize >= 0.1) {
			return random(0, 1000) * 0.1;
		}

		if (minSectorSize < 0.1 && minSectorSize >= 0.01) {
			return random(0, 10000) * 0.01;
		}

		if (minSectorSize < 0.01 && minSectorSize >= 0.001) {
			return random(0, 100000) * 0.001;
		}

		if (minSectorSize < 0.001 && minSectorSize >= 0.0001) {
			return random(0, 1000000) * 0.0001;
		}

		if (minSectorSize < 0.0001 && minSectorSize >= 0.00001) {
			return random(0, 10000000) * 0.00001;
		}

		if (minSectorSize < 0.00001 && minSectorSize >= 0.000001) {
			return random(0, 100000000) * 0.000001;
		}

		if (minSectorSize < 0.000001) {
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
