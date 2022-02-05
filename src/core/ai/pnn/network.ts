import { sd, fix } from '@utils/math';
import { groupBy, extractKeysToArray } from '@utils/helpers';
import { saveJsonToFile } from '@utils/file';
import { Sample, InlineSample, normalizePattern } from '@core/ai/sample';

type PnnOptions = {
	samples?: Array<Sample>;
	inlineEngine?: InlinePredictionEngine;
};

function pnn(options: PnnOptions) {
	const { samples, inlineEngine } = options;
	if (inlineEngine) return recovery(inlineEngine);

	return new PredictionEngine(samples);
}

class PredictionEngine {
	private samples: Array<Sample> = [];
	private grouppedMap: Record<string, Array<Sample>> = {};
	private labels: Array<number> = [];

	constructor(samples: Array<Sample>) {
		this.samples = samples;
		this.grouppedMap = groupBy(Sample.normalize(samples), x => x.getLabel());
		this.labels = extractKeysToArray(this.grouppedMap, Number);
	}

	private predictOne(pattern: Array<number>) {
		const inputPattern = normalizePattern(pattern);
		const values: Array<number> = [];

		for (const label of this.labels) {
			const samples = this.grouppedMap[label];
			let gs = 0.0;

			for (const sample of samples) {
				const basePattern = sample.getPattern();
				const stdev = sd(basePattern);
				let dss = 0.0;

				for (let i = 0; i < basePattern.length; i++) {
					dss += Math.pow(basePattern[i] - inputPattern[i], 2.0);
				}

				gs += Math.exp((-1.0 * dss) / (2.0 * Math.pow(stdev, 2.0)));
			}

			values.push(gs);
		}

		const idx = values.indexOf(Math.max(...values));
		const predict = this.labels[idx];

		return predict;
	}

	private bench = (samples: Array<Sample>) => {
		let error = 0;

		for (const sample of samples) {
			const pattern = sample.getPattern();
			const label = sample.getLabel();
			const [prediction] = this.predict([pattern]);

			if (prediction !== label) {
				error++;
			}
		}

		return error;
	};

	public predict(patterns: Array<Array<number>>): Array<number> {
		const predictions = patterns.map(x => this.predictOne(x));

		return predictions;
	}

	public verasity(train: Array<Sample>, test: Array<Sample>) {
		let trainError = 0;
		let testError = 0;
		const trainValue = this.bench(train);
		const testValue = this.bench(test);

		trainError = fix((trainValue / train.length) * 100);
		testError = fix((testValue / test.length) * 100);

		console.log(`pnn algorithm:`);
		console.log(`number of train samples: ${train.length}`);
		console.log(`number of test samples: ${test.length}`);
		console.log(`in sample error: ${trainError.toFixed(2)}%`);
		console.log(`out of sample error: ${testError.toFixed(2)}%`);
		console.log('-----');

		return {
			trainError,
			testError,
		};
	}

	public toJSON(filename: string) {
		const samples = this.samples.map(x => {
			const sample: InlineSample = {
				label: x.getLabel(),
				pattern: x.getPattern(),
			};

			return sample;
		});

		const json = JSON.stringify({ samples });

		saveJsonToFile(json, filename);
	}
}

const recovery = (engine: InlinePredictionEngine): PredictionEngine => {
	const { samples: inlineSamples } = engine;
	const samples: Array<Sample> = [];

	for (const inlineSample of inlineSamples) {
		samples.push(new Sample(inlineSample.pattern, inlineSample.label));
	}

	return new PredictionEngine(samples);
};

type InlinePredictionEngine = {
	samples: Array<InlineSample>;
};

export { pnn };
