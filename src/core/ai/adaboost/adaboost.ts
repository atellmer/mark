import { createListFromMap, detectIsUndefined, firstTrueKey } from '@utils/helpers';
import { saveJsonToFile } from '@utils/file';
import { fixed } from '@utils/math';
import { Sample } from '../sample';
import { StrongClassifier, StrongClassifierObject, WeakClassifier } from './';

export type AdaBoostOptions = {
	samples?: Array<Sample>;
	estimatorsNumber?: number;
	trained?: RecoveryModel;
};

function adaboost(options: AdaBoostOptions): TrainedModel {
	const { samples, estimatorsNumber, trained } = options;

	const transformSamples = (samples: Array<Sample>, label: number): Array<Sample> => {
		const transformedSamples = [];

		for (let i = 0; i < samples.length; i++) {
			const pattern = samples[i].getPattern();
			const answer = samples[i].getAnswer();
			let sample: Sample = null;

			if (answer !== label) {
				sample = new Sample(pattern, -1);
			} else {
				sample = new Sample(pattern, 1);
			}

			transformedSamples.push(sample);
		}

		return transformedSamples;
	};

	const getLabels = (samples: Array<Sample>): Array<number> => {
		const map: Record<number, number> = {};

		for (const sample of samples) {
			const answer = sample.getAnswer();

			if (detectIsUndefined(map[answer])) {
				map[answer] = answer;
			}
		}

		return createListFromMap(map);
	};

	const train = (): TrainedModel => {
		const labels = getLabels(samples);
		const map: Record<number, Array<StrongClassifier>> = {};

		for (let i = 0; i < labels.length; i++) {
			const transformedSamples = transformSamples(samples, labels[i]);
			const classifiers = StrongClassifier.train(transformedSamples, estimatorsNumber);

			map[i] = classifiers;
		}

		return new TrainedModel(labels, map);
	};

	const recovery = (): TrainedModel => {
		const labels = trained.labels;
		const classifiersMap: Record<number, Array<StrongClassifier>> = {};

		for (let i = 0; i < labels.length; i++) {
			const items = trained.classifiersMap[i];

			for (let j = 0; j < items.length; j++) {
				const item = items[j];
				const strong = new StrongClassifier();
				const weak = new WeakClassifier();

				weak.setDirection(item.weak.direction);
				weak.setFeatureIndex(item.weak.featureIndex);
				weak.setThreshold(item.weak.threshold);

				strong.setAlfa(item.alfa);
				strong.setWeak(weak);

				if (!classifiersMap[i]) {
					classifiersMap[i] = [];
				}

				classifiersMap[i].push(strong);
			}
		}

		return new TrainedModel(labels, classifiersMap);
	};

	return trained ? recovery() : train();
}

class TrainedModel {
	private labels: Array<number> = [];
	private classifiersMap: Record<number, Array<StrongClassifier>> = {};

	constructor(labels: Array<number>, classifiersMap: Record<number, Array<StrongClassifier>>) {
		this.labels = labels;
		this.classifiersMap = classifiersMap;
	}

	public toJSON(filename: string) {
		const json = JSON.stringify({
			labels: this.labels,
			classifiersMap: this.classifiersMap,
		});

		saveJsonToFile(json, filename);
	}

	public verasity(trainSamples: Array<Sample>, testSamples: Array<Sample>) {
		const train = {
			correctPercent: 0,
			incorectPercent: 0,
			incorrectCount: 0,
			total: trainSamples.length,
		};
		const test = {
			correctPercent: 0,
			incorectPercent: 0,
			incorrectCount: 0,
			total: testSamples.length,
		};

		train.incorrectCount = this.bench(trainSamples);
		train.incorectPercent = fixed((train.incorrectCount / trainSamples.length) * 100);
		train.correctPercent = fixed(100 - train.incorectPercent);

		test.incorrectCount = this.bench(testSamples);
		test.incorectPercent = fixed((test.incorrectCount / testSamples.length) * 100);
		test.correctPercent = fixed(100 - test.incorectPercent);

		return {
			train,
			test,
		};
	}

	public predict(pattern: Array<number>) {
		const map = {};

		for (let i = 0; i < this.labels.length; i++) {
			const classifiers = this.classifiersMap[i];
			const label = this.labels[i];
			const predict = StrongClassifier.predict(pattern, classifiers);

			map[label] = predict === 1;
		}

		const predict = Number(firstTrueKey(map));

		return predict;
	}

	private bench = (samples: Array<Sample>) => {
		let error = 0;

		for (const sample of samples) {
			const pattern = sample.getPattern();
			const answer = sample.getAnswer();
			const prediction = this.predict(pattern);

			if (prediction !== answer) {
				error++;
			}
		}

		return error;
	};
}

type RecoveryModel = {
	labels: Array<number>;
	classifiersMap: Record<number, Array<StrongClassifierObject>>;
};

export { adaboost };
