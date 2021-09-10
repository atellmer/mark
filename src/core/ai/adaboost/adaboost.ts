import { max, fix } from '@utils/math';
import { Sample } from '@core/ai/sample';
import { Label } from '@core/ai/adaboost/models';
import { Estimator } from '@core/ai/adaboost/estimator';

function adaboost(samples: Array<Sample>, estimatorsTotal: number) {
	return train(samples, estimatorsTotal);
}

function train(sourceSamples: Array<Sample>, estimatorsTotal: number): PredictionEngine {
	const sourceLabels: Array<number> = getSourceLabels(sourceSamples);
	const estimatorsMap: Record<number, Array<Estimator>> = {};

	for (const sourceLabel of sourceLabels) {
		const samples = prepareSamples(sourceSamples, sourceLabel);
		const estimators = Estimator.train(samples, estimatorsTotal);

		estimatorsMap[sourceLabel] = estimators;
	}

	return new PredictionEngine(sourceLabels, estimatorsMap);
}

function getSourceLabels(samples: Array<Sample>): Array<number> {
	const map: Record<number, boolean> = {};
	const items: Array<number> = [];

	for (const sample of samples) {
		const label = sample.getLabel();

		if (!map[label]) {
			map[label] = true;
			items.push(label);
		}
	}

	return items;
}

function prepareSamples(samples: Array<Sample>, sourceLabel: number): Array<Sample> {
	const items: Array<Sample> = [];

	for (const sample of samples) {
		const pattern = sample.getPattern();
		const label = sample.getLabel();
		const transformedSample =
			label !== sourceLabel ? new Sample(pattern, Label.NEGATIVE) : new Sample(pattern, Label.POSITIVE);

		items.push(transformedSample);
	}

	return items;
}

class PredictionEngine {
	private labels: Array<number> = [];
	private estimatorsMap: Record<number, Array<Estimator>> = {};

	constructor(labels: Array<number>, estimatorsMap: Record<number, Array<Estimator>>) {
		this.labels = labels;
		this.estimatorsMap = estimatorsMap;
	}

	public predict(pattern: Array<number>) {
		const values: Array<number> = [];

		for (const label of this.labels) {
			const estimators = this.estimatorsMap[label];
			const predict = Estimator.predict(pattern, estimators);

			values.push(predict);
		}

		const idx = values.indexOf(max(values));
		const predict = this.labels[idx];

		return predict;
	}

	public verasity(train: Array<Sample>, test: Array<Sample>) {
		let trainError = 0;
		let testError = 0;
		const trainValue = this.bench(train);
		const testValue = this.bench(test);

		trainError = fix((trainValue / train.length) * 100);
		testError = fix((testValue / test.length) * 100);

		console.log(`number of train samples: ${train.length}`);
		console.log(`number of test samples: ${test.length}`);
		console.log(`in sample error: ${trainError}%`);
		console.log(`out of sample error: ${testError}%`);
		console.log('-----');

		return {
			trainError,
			testError,
		};
	}

	private bench = (samples: Array<Sample>) => {
		let error = 0;

		for (const sample of samples) {
			const pattern = sample.getPattern();
			const label = sample.getLabel();
			const prediction = this.predict(pattern);

			if (prediction !== label) {
				error++;
			}
		}

		return error;
	};
}

export { adaboost };
