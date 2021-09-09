import { abs } from '@utils/math';
import { Sample } from '../sample';
import { Direction, Answer } from './models';

class WeakClassifier {
	private featureIndex: number;
	private threshold: number;
	private direction: Direction;

	public getFeatureIndex(): number {
		return this.featureIndex;
	}

	public setFeatureIndex(featureIndex: number) {
		this.featureIndex = featureIndex;
	}

	public getThreshold(): number {
		return this.threshold;
	}

	public setThreshold(threshold: number) {
		this.threshold = threshold;
	}

	public getDirection(): Direction {
		return this.direction;
	}

	public setDirection(direction: Direction) {
		this.direction = direction;
	}

	public static train(samples: Array<Sample>): WeakClassifier {
		const size = samples.length;
		const length = samples[0].getPattern().length;
		const features: Array<Feature> = [];
		const error: Array<number> = [];
		const weak = new WeakClassifier();
		let threshold = 0;
		let direction: Direction = null;
		let minimalError = Number.POSITIVE_INFINITY;

		for (let j = 0; j < length; j++) {
			for (let i = 0; i < size; i++) {
				features[i] = {
					value: samples[i].getPattern()[j],
					answer: samples[i].getAnswer(),
				};
			}

			features.sort((a, b) => a.value - b.value);

			for (let i = 0; i < size - 1; i++) {
				if (features[i].answer != features[i + 1].answer && features[i].value != features[i + 1].value) {
					threshold = (features[i].value + features[i + 1].value) / 2.0;

					if (features[i].answer >= 0) {
						direction = Direction.UP;
					} else {
						direction = Direction.DOWN;
					}

					error[j] = 0;

					for (let k = 0; k < size; k++) {
						error[j] += abs(features[k].answer - WeakClassifier.predict(features[k].value, threshold, direction)) / 2.0;
					}

					if (error[j] < minimalError) {
						minimalError = error[j];
						weak.setFeatureIndex(j);
						weak.setThreshold(threshold);
						weak.setDirection(direction);
					}
				}
			}
		}

		return weak;
	}

	public static predict(value: number, treshold: number, direction: Direction): Answer {
		if (direction > 0) {
			if (value <= treshold) {
				return Answer.POSITIVE;
			}

			return Answer.NEGATIVE;
		}

		if (value <= treshold) {
			return Answer.NEGATIVE;
		}

		return Answer.POSITIVE;
	}
}

type Feature = {
	value: number;
	answer: number;
};

export { WeakClassifier };
