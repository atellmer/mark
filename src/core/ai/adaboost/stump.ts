import { abs } from '@utils/math';
import { Sample } from '@core/ai/sample';
import { Direction, Label } from '@core/ai/adaboost/models';

class DecisionStump {
	private featureIdx: number;
	private threshold: number;
	private direction: Direction;

	constructor(featureIdx?: number, threshold?: number, direction?: Direction) {
		this.featureIdx = featureIdx || 0;
		this.threshold = threshold || 0;
		this.direction = direction || Direction.UP;
	}

	public getFeatureIdx(): number {
		return this.featureIdx;
	}

	public setFeatureIdx(featureIdx: number) {
		this.featureIdx = featureIdx;
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

	public predict(options: DecisionStumpPredictOptions): Label {
		const { value, threshold = this.threshold, direction = this.direction } = options;
		const label =
			direction === Direction.UP
				? value <= threshold
					? Label.POSITIVE
					: Label.NEGATIVE
				: value <= threshold
				? Label.NEGATIVE
				: Label.POSITIVE;

		return label;
	}

	public static train(samples: Array<Sample>): DecisionStump {
		const stump = new DecisionStump();
		const [sample] = samples;
		let minimalError = Number.POSITIVE_INFINITY;
		let currentError = 0.0;

		for (let featureIdx = 0; featureIdx < sample.getLength(); featureIdx++) {
			const features = samples
				.map(x => new Feature(x.getFeatureValue(featureIdx), x.getLabel()))
				.sort((a, b) => a.getValue() - b.getValue());

			for (let i = 0; i < features.length - 1; i++) {
				const feature = features[i];
				const nextFeature = features[i + 1];
				const value = feature.getValue();
				const nextValue = nextFeature.getValue();
				const label = feature.getLabel();
				const nextLabel = nextFeature.getLabel();

				if (label === nextLabel) continue;

				const threshold = (value + nextValue) / 2.0;
				const direction = label === Label.POSITIVE ? Direction.UP : Direction.DOWN;

				currentError = 0.0;

				for (const feature of features) {
					const label = feature.getLabel();
					const prediction = stump.predict({ value: feature.getValue(), threshold, direction });

					currentError += abs(label - prediction) / 2.0;
				}

				if (currentError < minimalError) {
					minimalError = currentError;

					stump.setFeatureIdx(featureIdx);
					stump.setThreshold(threshold);
					stump.setDirection(direction);
				}

				if (minimalError === 0) break;
			}
		}

		return stump;
	}
}

type DecisionStumpPredictOptions = {
	value: number;
	threshold?: number;
	direction?: Direction;
};

class Feature {
	private value: number;
	private label: number;

	constructor(value: number, label: number) {
		this.value = value;
		this.label = label;
	}

	public getValue(): number {
		return this.value;
	}

	public getLabel(): number {
		return this.label;
	}
}

export type InlineDecisionStump = {
	featureIdx: number;
	threshold: number;
	direction: number;
};

export { DecisionStump };
