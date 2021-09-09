import { log, exp } from '@utils/math';
import { Sample } from '../sample';
import { Answer } from './models';
import { WeakClassifier } from './weak-classifier';
import { ProbabilitySelector } from './probability-selector';

class StrongClassifier {
	private weak: WeakClassifier;
	private alfa: number;

	public getWeakClassifier(): WeakClassifier {
		return this.weak;
	}

	public setWeakClassifier(weak: WeakClassifier) {
		this.weak = weak;
	}

	public getAlfa(): number {
		return this.alfa;
	}

	public setAlfa(alfa: number) {
		this.alfa = alfa;
	}

	public static train(samples: Array<Sample>, estimatorsNumber: number): Array<StrongClassifier> {
		const size = samples.length;
		const weights: Array<number> = [];
		const predictions: Array<Answer> = [];
		const classifiers: Array<StrongClassifier> = [];
		let selectedSamples = [...samples];
		let weightsSum = 0;
		let epsilon = 0;
		let alfa = 0;

		for (let i = 0; i < size; i++) {
			weights[i] = 1 / size;
		}

		for (let k = 0; k < estimatorsNumber; k++) {
			const weak = WeakClassifier.train(selectedSamples);
			const strong = new StrongClassifier();
			epsilon = 0;
			weightsSum = 0;
			alfa = 0;

			for (let i = 0; i < size; i++) {
				predictions[i] = WeakClassifier.predict(
					samples[i].getPattern()[weak.getFeatureIndex()],
					weak.getThreshold(),
					weak.getDirection(),
				);

				if (samples[i].getAnswer() != predictions[i]) {
					epsilon += weights[i];
				}
			}

			if (epsilon === 0) {
				epsilon = 0.000000000000001;
			}

			if (epsilon === 1) {
				epsilon = 0.999999999999999;
			}

			alfa = 0.5 * log((1 - epsilon) / epsilon);

			strong.setWeakClassifier(weak);
			strong.setAlfa(alfa);
			classifiers[k] = strong;

			for (let i = 0; i < size; i++) {
				weightsSum += weights[i] * exp(-1 * alfa * samples[i].getAnswer() * predictions[i]);
			}

			for (let i = 0; i < size; i++) {
				weights[i] = (weights[i] * exp(-1 * alfa * samples[i].getAnswer() * predictions[i])) / weightsSum;
			}

			selectedSamples = ProbabilitySelector.select(weights, selectedSamples);
		}

		return classifiers;
	}

	public static predict(pattern: Array<number>, classifiers: Array<StrongClassifier>): Answer {
		let weak: WeakClassifier;
		let answer = 0;

		for (let k = 0; k < classifiers.length; k++) {
			weak = classifiers[k].getWeakClassifier();
			answer +=
				classifiers[k].getAlfa() *
				WeakClassifier.predict(pattern[weak.getFeatureIndex()], weak.getThreshold(), weak.getDirection());
		}

		if (answer > 0) {
			return Answer.POSITIVE;
		}

		return Answer.NEGATIVE;
	}
}

export type StrongClassifierObject = {
	alfa: number;
	weak: {
		direction: number;
		featureIndex: number;
		threshold: number;
	};
};

export { StrongClassifier };
