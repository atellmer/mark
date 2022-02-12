import { fix } from '@utils/math';
import { extractKeysToArray, detectIsNumber } from '@utils/helpers';
import { saveJsonToFile } from '@utils/file';
import { Sample } from '@core/ai/sample';
import {
	DecisionTreeVariant,
	DecisionTreeFitOptions,
	DecisionTreeRecoveryOptions,
	InlineDecisionNode,
	NodeType,
	ParentDecisionNode,
	LeafDecisionNode,
	FeatureValue,
	Criteria,
} from './models';

type DecisionTreeOptions = {
	variant: DecisionTreeVariant;
} & (DecisionTreeFitOptions | DecisionTreeRecoveryOptions);

function decisiontree(options: DecisionTreeOptions): PredictionEngine {
	const { variant } = options;

	if (variant === 'recovery') {
		const { inlineEngine } = options;

		return new PredictionEngine(recovery(inlineEngine.tree));
	}

	const { samples, maxDepth } = options;

	return new PredictionEngine(fit({ samples, maxDepth }));
}

class PredictionEngine {
	private tree: DecisionNode;

	constructor(tree: DecisionNode) {
		this.tree = tree;
	}

	public toJSON(filename: string) {
		const json = JSON.stringify({
			tree: this.tree,
		});

		saveJsonToFile(json, filename);
	}

	public predict(pattern: Array<FeatureValue>): number {
		return this.tree.predict(pattern);
	}

	private bench(samples: Array<Sample>): number {
		let error = 0;

		for (const sample of samples) {
			const pattern = sample.getPattern();
			const label = sample.getLabel();
			const prediction = this.tree.predict(pattern);

			if (prediction !== label) {
				error++;
			}
		}

		return error;
	}

	verasity(options: VerasityOptions) {
		const { test, train } = options;
		let trainError = 0;
		let testError = 0;
		const trainValue = this.bench(train);
		const testValue = this.bench(test);

		trainError = fix((trainValue / train.length) * 100);
		testError = fix((testValue / test.length) * 100);

		console.log(`decision tree algorithm:`);
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
}

function recovery(tree: Partial<InlineDecisionNode>): DecisionNode {
	const { type, featureIdx, threshold, distribution, leftNode, rightNode } = tree;

	if (type === 'parent') {
		return new DecisionNode({
			type: 'parent',
			featureIdx,
			threshold,
			leftNode: recovery(leftNode),
			rightNode: recovery(rightNode),
		});
	}

	return new DecisionNode({ type: 'leaf', distribution });
}

type FitOptions = {
	samples: Array<Sample>;
	depth?: number;
	maxDepth?: number;
};

function fit(options: FitOptions): DecisionNode {
	const { samples, depth = 0, maxDepth = Infinity } = options;
	if (samples.length === 0) return null;
	const score = entropy(samples);
	let bestGain = 0;
	let criteria: Criteria = null;
	let sets: [Array<Sample>, Array<Sample>] = null;
	const columnCount = samples[0].getLength();

	for (let featureIdx = 0; featureIdx < columnCount; featureIdx++) {
		for (const sample of samples) {
			const pattern = sample.getPattern();
			const threshold = pattern[featureIdx];
			const [setLeft, setRight] = divideSet({ samples, featureIdx, threshold });
			const p = setLeft.length / samples.length;
			const gain = score - p * entropy(setLeft) - (1 - p) * entropy(setRight);

			if (gain > bestGain && setLeft.length > 0 && setRight.length > 0) {
				bestGain = gain;
				criteria = { featureIdx, threshold };
				sets = [setLeft, setRight];
			}
		}
	}

	if (bestGain > 0 && depth < maxDepth) {
		const [setLeft, setRight] = sets;

		return new DecisionNode({
			type: 'parent',
			featureIdx: criteria.featureIdx,
			threshold: criteria.threshold,
			leftNode: fit({ samples: setLeft, depth: depth + 1, maxDepth }),
			rightNode: fit({ samples: setRight, depth: depth + 1, maxDepth }),
		});
	}

	return new DecisionNode({ type: 'leaf', distribution: getDistribution(samples) });
}

type DecisionNodeConstructor = {
	type: NodeType;
} & (ParentDecisionNode<DecisionNode> | LeafDecisionNode);

class DecisionNode {
	private type: NodeType;
	private featureIdx: number;
	private threshold: FeatureValue;
	private leftNode: DecisionNode;
	private rightNode: DecisionNode;
	private distribution: Record<string, number>;

	constructor(options: DecisionNodeConstructor) {
		const { type } = options;

		this.type = type;

		if (type === 'parent') {
			this.featureIdx = options.featureIdx;
			this.threshold = options.threshold;
			this.leftNode = options.leftNode;
			this.rightNode = options.rightNode;
		} else {
			this.distribution = options.distribution;
		}
	}

	public predict(pattern: Array<FeatureValue>): number {
		if (this.type === 'parent') {
			const value = pattern[this.featureIdx];
			const isLeft = detectIsNumber(this.threshold) ? value >= this.threshold : value === this.threshold;

			return isLeft ? this.leftNode.predict(pattern) : this.rightNode.predict(pattern);
		}

		const labels = extractKeysToArray(this.distribution, Number);
		const values = labels.map(x => this.distribution[x]);
		const idx = values.indexOf(Math.max(...values));
		const predict = labels[idx];

		return predict;
	}
}

type DivideSetOptions = {
	samples: Array<Sample>;
	featureIdx: number;
	threshold: FeatureValue;
};

function divideSet(options: DivideSetOptions): [Array<Sample>, Array<Sample>] {
	const { samples, featureIdx, threshold } = options;
	const [sample] = samples;
	const splitFn = (x: Sample) => {
		const pattern = x.getPattern() as Array<FeatureValue>;
		const value = pattern[featureIdx];

		return detectIsNumber(threshold) ? value >= threshold : value === threshold;
	};
	const setLeft: Array<Sample> = [];
	const setRight: Array<Sample> = [];

	if (featureIdx > sample.getLength() - 1) {
		throw new Error('idx is out of pattern length!');
	}

	for (const sample of samples) {
		if (splitFn(sample)) {
			setLeft.push(sample);
		} else {
			setRight.push(sample);
		}
	}

	return [setLeft, setRight];
}

function getDistribution(samples: Array<Sample>): Record<string, number> {
	const map: Record<string, number> = {};

	for (const sample of samples) {
		const label = sample.getLabel();

		if (!map[label]) {
			map[label] = 0;
		}

		map[label]++;
	}

	return map;
}

function entropy(samples: Array<Sample>): number {
	const distribution = getDistribution(samples);
	const labels = extractKeysToArray(distribution, Number);
	let ent = 0.0;

	for (const label of labels) {
		const p = distribution[label] / samples.length;

		ent = ent - p * Math.log2(p);
	}

	return ent;
}

type VerasityOptions = {
	train: Array<Sample>;
	test: Array<Sample>;
};

export { decisiontree };
