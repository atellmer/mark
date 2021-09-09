import { createListFromMap, detectIsUndefined, firstTrueKey } from '@utils/helpers';
import { Sample } from '../sample';
import { StrongClassifier } from '../adaboost';

class AdaBoost {
	private samples: Array<Sample> = [];
	private estimatorsNumber: number;

	constructor(samples: Array<Sample>, estimatorsNumber: number) {
		this.samples = samples;
		this.estimatorsNumber = estimatorsNumber;
	}

	private static transformSamples(samples: Array<Sample>, label: number): Array<Sample> {
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
	}

	private static getLabels(samples: Array<Sample>): Array<number> {
		const map: Record<number, number> = {};

		for (const sample of samples) {
			const answer = sample.getAnswer();

			if (detectIsUndefined(map[answer])) {
				map[answer] = answer;
			}
		}

		return createListFromMap(map);
	}

	public train(): AdaBoostTrainedModel {
		const labels = AdaBoost.getLabels(this.samples);
		const map: Record<number, Array<StrongClassifier>> = {};

		for (let i = 0; i < labels.length; i++) {
			const transformedSamples = AdaBoost.transformSamples(this.samples, labels[i]);
			const classifiers = StrongClassifier.train(transformedSamples, this.estimatorsNumber);

			map[i] = classifiers;
		}

		return new AdaBoostTrainedModel(labels, map);
	}
}

class AdaBoostTrainedModel {
	private labels: Array<number> = [];
	private classifiersMap: Record<number, Array<StrongClassifier>> = {};

	constructor(labels: Array<number>, classifiersMap: Record<number, Array<StrongClassifier>>) {
		this.labels = labels;
		this.classifiersMap = classifiersMap;
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
}

export { AdaBoost };
