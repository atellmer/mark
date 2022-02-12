import { Sample } from '@core/ai/sample';

type DecisionTreeNodeConstructor = {
	columnIdx: number;
	value: number;
	results?: Record<string, number>;
	leftNode: DecisionTreeNode;
	rightNode: DecisionTreeNode;
};

class DecisionTreeNode {
	private columnIdx: number;
	private value: number;
	private results: Record<string, number>;
	private leftNode: DecisionTreeNode;
	private rightNode: DecisionTreeNode;

	constructor(options: DecisionTreeNodeConstructor) {
		this.columnIdx = options.columnIdx;
		this.value = options.value;
		this.results = options.results || null;
		this.leftNode = options.leftNode;
		this.rightNode = options.rightNode;
	}
}

type DivideSetOptions = {
	samples: Array<Sample>;
	columnIdx: number;
	threshold: number;
};

function devideSet(options: DivideSetOptions): [Array<Sample>, Array<Sample>] {
	const { samples, columnIdx, threshold } = options;
	const [sample] = samples;
	const splitFn =
		typeof threshold === 'number'
			? (x: Sample) => x.getPattern()[columnIdx] >= threshold
			: (x: Sample) => x.getPattern()[columnIdx] === threshold;
	const setLeft: Array<Sample> = [];
	const setRight: Array<Sample> = [];

	if (columnIdx > sample.getLength() - 1) {
		throw new Error('idx out of pattern lenght!');
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

export { DecisionTreeNode, devideSet };
