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

	public toString(): string {
		return `pattern: [${this.pattern.join(';')}], answer: ${this.answer}`;
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

	public static normalize(samples: Array<Sample>) {
		const normalized = [];

		for (const sample of samples) {
			normalized.push(Sample.normalizeOne(sample));
		}

		return normalized;
	}
}

export { Sample };