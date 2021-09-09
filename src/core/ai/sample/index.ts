import { mean, pow, sqrt, exp } from '@utils/math';

class Sample {
	private pattern: Array<number>;
	private answer: number;

	constructor(pattern: Array<number>, answer: number) {
		this.pattern = pattern;
		this.answer = answer;
	}

	public getPattern(): Array<number> {
		return this.pattern;
	}

	public getAnswer(): number {
		return this.answer;
	}

	public static normalizeOne(sample: Sample): Sample {
		const pattern = sample.getPattern();
		const patternNormalized = [];
		const count = pattern.length;
		const average = mean(pattern);
		let stdDev = 0.0;

		for (const feature of pattern) {
			stdDev += pow(feature - average, 2);
		}

		stdDev = sqrt(stdDev / (count - 1));

		for (let i = 0; i < count; i++) {
			patternNormalized[i] = (pattern[i] - average) / stdDev;
			patternNormalized[i] =
				(exp(patternNormalized[i]) - exp(-1 * patternNormalized[i])) /
				(exp(patternNormalized[i]) + exp(-1 * patternNormalized[i]));
		}

		return new Sample(patternNormalized, sample.getAnswer());
	}

	public static normalize(samples: Array<Sample>): Array<Sample> {
		const normalized: Array<Sample> = [];

		for (const sample of samples) {
			normalized.push(Sample.normalizeOne(sample));
		}

		return normalized;
	}

	public static fromDataset(dataset: Array<Array<number>>): Array<Sample> {
		const samples: Array<Sample> = [];

		for (const item of dataset) {
			const lastIndex = item.length - 1;
			const answer = Number(item[lastIndex]);
			const pattern = item
				.slice(0, lastIndex)
				.map(x => String(x).replace(',', '.'))
				.map(Number);

			samples.push(new Sample(pattern, answer));
		}

		return samples;
	}
}

export { Sample };
