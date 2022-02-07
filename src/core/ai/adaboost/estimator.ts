import { Sample } from '@core/ai/sample';
import { DecisionStump, InlineDecisionStump } from '@core/ai/adaboost/stump';
import { Label } from '@core/ai/adaboost/models';
import { Logger } from '@core/ai/adaboost/logger';
import { bootstrapSampling, Weight } from './bootstrap';

class Estimator {
	private alfa: number;
	private stump: DecisionStump;

	constructor(alfa?: number, stump?: DecisionStump) {
		this.alfa = alfa;
		this.stump = stump;
	}

	public getAlfa(): number {
		return this.alfa;
	}

	public setAlfa(alfa: number) {
		this.alfa = alfa;
	}

	public getStump() {
		return this.stump;
	}

	public setStump(stump: DecisionStump) {
		this.stump = stump;
	}

	public static predict(pattern: Array<number>, estimators: Array<Estimator>): Label {
		let vote = 0;

		for (const estimator of estimators) {
			const alfa = estimator.getAlfa();
			const stump = estimator.getStump();
			const value = pattern[stump.getFeatureIdx()];
			const prediction = stump.predict({ value }) as number;

			vote += alfa * prediction;
		}

		return vote > 0 ? Label.POSITIVE : Label.NEGATIVE;
	}

	public static train(options: TrainOptions): Array<Estimator> {
		const { samples, label, estimatorsTotal, logger, samplingSize } = options;
		const estimators: Array<Estimator> = [];
		const weights: Array<Weight> = samples.map((_, idx) => ({ value: 1 / samples.length, idx }));
		const size = samples.length;
		let selectedSamples: Array<Sample> = samples.slice(0, samplingSize);

		for (let estimatorIdx = 0; estimatorIdx < estimatorsTotal; estimatorIdx++) {
			const estimator = new Estimator();
			const stump = DecisionStump.train(selectedSamples);
			const predictions: Array<Label> = [];
			let epsilon = 0.0;
			let alfa = 0.0;
			let totalWeights = 0.0;

			for (let i = 0; i < size; i++) {
				const sample = samples[i];
				const pattern = sample.getPattern();
				const label = sample.getLabel();
				const value = pattern[stump.getFeatureIdx()];
				const prediction = stump.predict({ value });

				if (label !== prediction) {
					epsilon += weights[i].value;
				}

				predictions.push(prediction);
			}

			if (epsilon <= 0) {
				epsilon = 0.00001;
			}

			if (epsilon >= 1) {
				epsilon = 0.99999;
			}

			alfa = 0.5 * Math.log((1 - epsilon) / epsilon);

			estimator.setAlfa(alfa);
			estimator.setStump(stump);

			logger.log('label:', label, 'estimator #', estimatorIdx + 1, 'epsilon:', epsilon, 'alfa:', alfa);

			estimators.push(estimator);

			for (let i = 0; i < size; i++) {
				const sample = samples[i];
				const label = sample.getLabel();

				totalWeights += weights[i].value * Math.exp(-1 * alfa * label * predictions[i]);
			}

			for (let i = 0; i < size; i++) {
				const sample = samples[i];
				const label = sample.getLabel();

				weights[i].value = (weights[i].value * Math.exp(-1 * alfa * label * predictions[i])) / totalWeights;
			}

			selectedSamples = bootstrapSampling({ weights, samples, samplingSize });
		}

		return estimators;
	}
}

type TrainOptions = {
	samples: Array<Sample>;
	estimatorsTotal: number;
	samplingSize: number;
	label: number;
	logger: Logger;
};

export type InlineEstimator = {
	alfa: number;
	stump: InlineDecisionStump;
};

export { Estimator };
