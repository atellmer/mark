import { max, fix } from '@utils/math';
import { saveJsonToFile } from '@utils/file';
import { Sample, normalizePattern } from '@core/ai/sample';
import { Label } from '@core/ai/adaboost/models';
import { Estimator, InlineEstimator } from '@core/ai/adaboost/estimator';
import { DecisionStump } from '@core/ai/adaboost/stump';
import { Logger } from '@core/ai/adaboost/logger';

type AdaBoostOptions = {
	samples?: Array<Sample>;
	estimatorsTotal?: number;
	inlineEngine?: InlinePredictionEngine;
	enableLogs?: boolean;
};

function adaboost(options: AdaBoostOptions) {
	const { samples, estimatorsTotal, inlineEngine, enableLogs } = options;
	if (inlineEngine) return recovery(inlineEngine);
	const normalSamples = Sample.normalize(samples);
	const logger = new Logger(enableLogs);

	return train({ samples: normalSamples, estimatorsTotal, logger });
}

type TrainOptions = {
	samples: Array<Sample>;
	estimatorsTotal: number;
	logger: Logger;
};

function train(options: TrainOptions): PredictionEngine {
	const { samples: sourceSamples, estimatorsTotal, logger } = options;
	const sourceLabels: Array<number> = getSourceLabels(sourceSamples);
	const estimatorsMap: Record<number, Array<Estimator>> = {};

	for (const sourceLabel of sourceLabels) {
		const samples = prepareSamples(sourceSamples, sourceLabel);
		const estimators = Estimator.train(samples, estimatorsTotal, sourceLabel, logger);

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

const recovery = (engine: InlinePredictionEngine): PredictionEngine => {
	const labels = engine.labels;
	const estimatorsMap: Record<number, Array<Estimator>> = {};

	for (const label of labels) {
		const inlineEstimators = engine.estimatorsMap[label];

		for (let j = 0; j < inlineEstimators.length; j++) {
			const inlineEstimator = inlineEstimators[j];
			const { featureIdx, threshold, direction } = inlineEstimator.stump;
			const stump = new DecisionStump(featureIdx, threshold, direction);
			const estimator = new Estimator(inlineEstimator.alfa, stump);

			if (!estimatorsMap[label]) {
				estimatorsMap[label] = [];
			}

			estimatorsMap[label].push(estimator);
		}
	}

	return new PredictionEngine(labels, estimatorsMap);
};

class PredictionEngine {
	private labels: Array<number> = [];
	private estimatorsMap: Record<number, Array<Estimator>> = {};

	constructor(labels: Array<number>, estimatorsMap: Record<number, Array<Estimator>>) {
		this.labels = labels;
		this.estimatorsMap = estimatorsMap;
	}

	private predictOne(pattern: Array<number>) {
		const normalPattern = normalizePattern(pattern);
		const values: Array<number> = [];

		for (const label of this.labels) {
			const estimators = this.estimatorsMap[label];
			const predict = Estimator.predict(normalPattern, estimators);

			values.push(predict);
		}

		const idx = values.indexOf(max(values));
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
		const predictions: Array<number> = patterns.map(x => this.predictOne(x));

		return predictions;
	}

	public verasity(train: Array<Sample>, test: Array<Sample>) {
		let trainError = 0;
		let testError = 0;
		const trainValue = this.bench(train);
		const testValue = this.bench(test);

		trainError = fix((trainValue / train.length) * 100);
		testError = fix((testValue / test.length) * 100);

		console.log(`adaboost algorithm:`);
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
		const json = JSON.stringify({
			labels: this.labels,
			estimatorsMap: this.estimatorsMap,
		});

		saveJsonToFile(json, filename);
	}
}

type InlinePredictionEngine = {
	labels: Array<number>;
	estimatorsMap: Record<number, Array<InlineEstimator>>;
};

export { adaboost };
