import { randomInt, random } from '@utils/math';
import { AbstractMetaNode, MetaContext } from './shared';
import { ParameterNode } from './parameter';
import { ConstantNode } from './constant';

class OperatorNode extends AbstractMetaNode {
	private operator: Operator;
	private children: Array<AbstractMetaNode>;
	private lifetime = 0;
	private error: number = null;

	constructor(operator: Operator, children: Array<AbstractMetaNode>) {
		super();
		this.operator = operator;
		this.children = children;
	}

	public setLifetime(lifetime: number) {
		this.lifetime = lifetime;
	}

	public incrementLifetime() {
		this.lifetime++;
	}

	public getLifetime(): number {
		return this.lifetime;
	}

	public setError(error: number) {
		this.error = error;
	}

	public getError(): number {
		return this.error;
	}

	public evaluate(): number {
		return this.operator.execute(this.children);
	}

	public print(): string {
		return this.operator.print(this.children);
	}

	public predict(pattern: Array<number>): number {
		MetaContext.setPattern(pattern);

		return this.operator.execute(this.children);
	}

	public clone(): OperatorNode {
		const children: Array<AbstractMetaNode> = [];

		for (const child of this.children) {
			children.push(child.clone());
		}

		const node = new OperatorNode(this.operator, children);

		node.setError(this.error);
		node.setLifetime(this.lifetime);

		return node;
	}

	public mutate(prob: number): void {
		const node = OperatorNode.createRandomNode();

		if (random(0, 1) < 0.5) {
			if (node.operator.type !== this.operator.type) {
				const childrenLength = this.children.length;
				const nodesCount = node.operator.nodesCount;

				this.operator = node.operator;

				if (childrenLength > nodesCount) {
					this.children = this.children.slice(0, nodesCount);
				} else if (childrenLength < nodesCount) {
					this.children.push(...node.children.slice(childrenLength));
				}
			} else {
				for (const child of this.children) {
					if (random(0, 1) < prob) {
						child.mutate(prob);
					}
				}
			}
		} else {
			const idxOne = randomInt(0, this.operator.nodesCount - 1);
			const idxTwo = randomInt(0, node.operator.nodesCount - 1);

			this.children[idxOne] = node.children[idxTwo];
		}
	}

	public cross(partner: AbstractMetaNode): OperatorNode {
		const nodeOne = this.clone();
		const nodeTwo = partner.clone();

		nodeOne.setError(null);
		nodeOne.setLifetime(0);

		if (nodeTwo instanceof ConstantNode || nodeTwo instanceof ParameterNode) {
			const idx = randomInt(0, nodeOne.operator.nodesCount - 1);

			nodeOne.children[idx] = nodeTwo;
		} else if (nodeTwo instanceof OperatorNode) {
			const idxOne = randomInt(0, nodeOne.operator.nodesCount - 1);
			const idxTwo = randomInt(0, nodeTwo.operator.nodesCount - 1);

			nodeOne.children[idxOne] = nodeTwo.children[idxTwo];
		}

		return nodeOne;
	}

	public static createRandomNode(depth = 1) {
		const { constantNodeProp, parameterNodeProp, maxDepth } = MetaContext.extract();
		const operatorCreators = [
			createAndOperator,
			createOrOperator,
			createGreaterOperator,
			createAddOperator,
			createSubtractOperator,
			createMultiplyOperator,
			createDivideOperator,
			creatPowOperator,
			creatPow2Operator,
			creatSqrtOperator,
		];
		const idx = randomInt(0, operatorCreators.length - 1);
		const operator = operatorCreators[idx]();
		const children = [];

		for (let i = 0; i < operator.nodesCount; i++) {
			const prob = random(0, 1);

			if (depth >= maxDepth) {
				if (prob < 0.5) {
					children.push(ConstantNode.createRandomNode());
				} else {
					children.push(ParameterNode.createRandomNode());
				}
			} else {
				if (prob < constantNodeProp) {
					children.push(ConstantNode.createRandomNode());
				} else if (prob < constantNodeProp + parameterNodeProp) {
					children.push(ParameterNode.createRandomNode());
				} else {
					children.push(OperatorNode.createRandomNode(depth + 1));
				}
			}
		}

		return new OperatorNode(operator, children);
	}
}

enum OperatorType {
	AND = 'and',
	OR = 'or',
	GREATER = 'greater',
	ADD = 'add',
	SUBTRACT = 'subtract',
	MULTIPLY = 'multiply',
	DIVIDE = 'divide',
	POW = 'pow',
	POW2 = 'pow2',
	SQRT = 'sqrt',
}

type Operator = {
	type: OperatorType;
	nodesCount: number;
	execute: (nodes: Array<AbstractMetaNode>) => number;
	print: (nodes: Array<AbstractMetaNode>) => string;
};

function createAndOperator(): Operator {
	const type = OperatorType.AND;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() && nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createOrOperator(): Operator {
	const type = OperatorType.OR;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() || nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createGreaterOperator(): Operator {
	const type = OperatorType.GREATER;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() > nodeRight.evaluate() ? 1 : 0;

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createAddOperator(): Operator {
	const type = OperatorType.ADD;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() + nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createSubtractOperator(): Operator {
	const type = OperatorType.SUBTRACT;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() - nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createMultiplyOperator(): Operator {
	const type = OperatorType.MULTIPLY;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() * nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createDivideOperator(): Operator {
	const type = OperatorType.DIVIDE;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() / nodeRight.evaluate();

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function creatSqrtOperator(): Operator {
	const type = OperatorType.SQRT;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.sqrt(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatPowOperator(): Operator {
	const type = OperatorType.POW;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = Math.pow(nodeLeft.evaluate(), nodeRight.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function creatPow2Operator(): Operator {
	const type = OperatorType.POW2;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.pow(node.evaluate(), 2);

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

export { OperatorNode };
