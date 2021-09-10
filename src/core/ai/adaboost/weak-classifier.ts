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
		const patternLength = samples[0].getPattern().length;
		const features: Array<Feature> = [];
		const weak = new WeakClassifier();
		let minimalError = Number.POSITIVE_INFINITY;
		let error = 0;

		for (let j = 0; j < patternLength; j++) {
			const featureIndex = j;

			for (let i = 0; i < size; i++) {
				features[i] = {
					value: samples[i].getPattern()[j],
					answer: samples[i].getAnswer(),
				};
			}

			features.sort((a, b) => a.value - b.value);

			for (let i = 0; i < size - 1; i++) {
				const currentAnswer = features[i].answer;
				const currentValue = features[i].value;
				const siblingAnswer = features[i + 1].answer;
				const siblingValue = features[i + 1].value;

				if (currentAnswer === siblingAnswer || currentValue === siblingValue) {
					continue;
				}

				const threshold = (currentValue + siblingValue) / 2.0;
				const direction: Direction = currentAnswer === Answer.POSITIVE ? Direction.UP : Direction.DOWN;

				error = 0.0;

				for (let k = 0; k < size; k++) {
					const featureValue = features[k].value;

					error += abs(features[k].answer - weak.predict(featureValue, threshold, direction)) / 2.0;
				}

				if (error < minimalError) {
					minimalError = error;

					weak.setFeatureIndex(featureIndex);
					weak.setThreshold(threshold);
					weak.setDirection(direction);
				}

				if (minimalError === 0) {
					break;
				}
			}
		}

		return weak;
	}

	public predict(featureValue: number, threshold = this.threshold, direction: Direction = this.direction): Answer {
		if (direction === Direction.UP) {
			return featureValue <= threshold ? Answer.POSITIVE : Answer.NEGATIVE;
		}

		return featureValue <= threshold ? Answer.NEGATIVE : Answer.POSITIVE;
	}
}

type Feature = {
	value: number;
	answer: number;
};

export { WeakClassifier };
