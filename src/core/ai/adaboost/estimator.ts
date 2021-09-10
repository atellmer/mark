import { log, exp, random } from '@utils/math';
import { Sample } from '@core/ai/sample';
import { DecisionStump, InlineDecisionStump } from '@core/ai/adaboost/stump';
import { Label } from '@core/ai/adaboost/models';

class Estimator {
	private alfa: number;
	private stump: DecisionStump;

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

	public static train(samples: Array<Sample>, estimatorsTotal: number): Array<Estimator> {
		const estimators: Array<Estimator> = [];
		const weights: Array<Weight> = samples.map((_, idx) => new Weight(1 / samples.length, idx));
		const size = samples.length;
		let randomSamples: Array<Sample> = [...samples];

		for (let estimatorIdx = 0; estimatorIdx < estimatorsTotal; estimatorIdx++) {
			const estimator = new Estimator();
			const stump = DecisionStump.train(randomSamples);
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
					epsilon += weights[i].getValue();
				}

				predictions.push(prediction);
			}

			if (epsilon <= 0) {
				epsilon = 0.00000000000000001;
			}

			if (epsilon >= 1) {
				epsilon = 0.99999999999999999;
			}

			alfa = 0.5 * log((1 - epsilon) / epsilon);

			estimator.setAlfa(alfa);
			estimator.setStump(stump);

			estimators.push(estimator);

			for (let i = 0; i < size; i++) {
				const sample = samples[i];
				const label = sample.getLabel();
				const prediction = predictions[i];
				const weight = weights[i].getValue();

				totalWeights += weight * exp(-1 * alfa * label * prediction);
			}

			for (let i = 0; i < size; i++) {
				const sample = samples[i];
				const label = sample.getLabel();
				const prediction = predictions[i];
				const weight = weights[i].getValue();
				const newWeight = (weight * exp(-1 * alfa * label * prediction)) / totalWeights;

				weights[i].setValue(newWeight);
			}

			randomSamples = selectRandomSamples(weights, samples);
		}

		return estimators;
	}
}

function selectRandomSamples(weights: Array<Weight>, samples: Array<Sample>): Array<Sample> {
	const select = (sourceWeights: Array<Weight>, samples: Array<Sample>): Array<Sample> => {
		const selectedSamples: Array<Sample> = [];
		const size = samples.length;
		const weights: Array<Weight> = [...sourceWeights].sort((a, b) => a.getValue() - b.getValue());
		let positiveTotal = 0;
		let negativeTotal = 0;
		let selectedPositiveTotal = 0;
		let selectedNegativeTotal = 0;

		for (let i = 0; i < size; i++) {
			const label = samples[i].getLabel();

			if (label === Label.POSITIVE) {
				positiveTotal++;
			} else {
				negativeTotal++;
			}
		}

		const wheel = whell(size, weights);

		while (selectedSamples.length < samples.length) {
			const rnd = random(0, 100);

			for (let i = 0; i < wheel.length - 1; i++) {
				if (rnd <= wheel[i] || rnd > wheel[i + 1]) continue;
				const nextWeight = weights[i + 1];
				const sample = samples[nextWeight.geIdx()];
				const label = sample.getLabel();

				if (label === Label.POSITIVE && selectedPositiveTotal < positiveTotal) {
					selectedSamples.push(sample);
					selectedPositiveTotal++;
				} else if (label === Label.NEGATIVE && selectedNegativeTotal < negativeTotal) {
					selectedSamples.push(sample);
					selectedNegativeTotal++;
				}
			}
		}

		return selectedSamples;
	};

	const whell = (size: number, weights: Array<Weight>): Array<number> => {
		const wheel: Array<number> = [];
		let sector = 0;
		let idx = 0;

		for (let i = 3; i < size + 3; i++) {
			sector = 0;

			for (let j = 0; j < i - 2; j++) {
				sector += weights[j].getValue();
			}

			wheel[idx] = sector * 100;
			idx++;
		}

		return wheel;
	};

	return select(weights, samples);
}

class Weight {
	private value: number;
	private idx: number;

	constructor(value: number, idx: number) {
		this.value = value;
		this.idx = idx;
	}

	public getValue(): number {
		return this.value;
	}

	public setValue(value: number) {
		this.value = value;
	}

	public geIdx(): number {
		return this.idx;
	}

	public setIdx(idx: number) {
		this.idx = idx;
	}
}

export type InlineEstimator = {
	alfa: number;
	stump: InlineDecisionStump;
};

export { Estimator };
