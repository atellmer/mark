import { mean, pow, sqrt, exp } from '@utils/math';

class Sample {
	private pattern: Array<number> = [];
	private label: number;

	constructor(pattern: Array<number>, answer: number) {
		this.pattern = pattern;
		this.label = answer;
	}

	public getPattern(): Array<number> {
		return this.pattern;
	}

	public getLabel(): number {
		return this.label;
	}

	public getLength(): number {
		return this.pattern.length;
	}

	public getFeatureValue(idx: number): number {
		return this.pattern[idx];
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

	public static normalize(samples: Array<Sample>): Array<Sample> {
		const normalSamples: Array<Sample> = [];

		for (const sample of samples) {
			const normalSample = new Sample(normalizePattern(sample.getPattern()), sample.getLabel());

			normalSamples.push(normalSample);
		}

		return normalSamples;
	}
}

function normalizePattern(pattern: Array<number>) {
	const normalPattern: Array<number> = [];
	const length = pattern.length;
	const average = mean(pattern);
	let stddev = 0.0;

	for (const feature of pattern) {
		stddev += pow(feature - average, 2);
	}

	stddev = sqrt(stddev / (length - 1));

	for (let i = 0; i < length; i++) {
		const x = (pattern[i] - average) / stddev;
		const y = (exp(x) - exp(-1 * x)) / (exp(x) + exp(-1 * x));

		normalPattern.push(y);
	}

	return normalPattern;
}

export { Sample, normalizePattern };
