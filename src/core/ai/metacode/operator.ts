import { randomInt, random } from '@utils/math';
import { AbstractMetaNode, MetaContext } from './shared';
import { ParameterNode } from './parameter';
import { ConstantNode } from './constant';

class OperatorNode extends AbstractMetaNode {
	private operator: Operator;
	private children: Array<AbstractMetaNode>;
	private error: number = null;

	constructor(operator: Operator, children: Array<AbstractMetaNode>) {
		super();
		this.operator = operator;
		this.children = children;
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
			createIfOperator,
			createGreaterOperator,
			createGreaterEqOperator,
			createLessOperator,
			createLessEqOperator,
			createAddOperator,
			createSubtractOperator,
			createMultiplyOperator,
			createDivideOperator,
			creatSqrtOperator,
			creatPowOperator,
			creatPow2Operator,
			creatPow3Operator,
			creatExpOperator,
			creatAbsOperator,
			creatLogOperator,
			creatLog2Operator,
			creatLog10Operator,
			creatRoundOperator,
			creatSignOperator,
			createMaxOperator,
			createMinOperator,
			createSinOperator,
			createSinhOperator,
			createCosOperator,
			createCoshOperator,
			createTanOperator,
			createTanhOperator,
			createHypotOperator,
			createTruncOperator,
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
	IF = 'if',
	GREATER = 'greater',
	GREATEREQ = 'greatereq',
	LESS = 'less',
	LESSEQ = 'lesseq',
	ADD = 'add',
	SUBTRACT = 'subtract',
	MULTIPLY = 'multiply',
	DIVIDE = 'divide',
	SQRT = 'sqrt',
	POW = 'pow',
	POW2 = 'pow2',
	POW3 = 'pow3',
	EXP = 'exp',
	ABS = 'abs',
	LOG = 'log',
	LOG2 = 'log2',
	LOG10 = 'log10',
	ROUND = 'round',
	SIGN = 'sign',
	MAX = 'max',
	MIN = 'min',
	SIN = 'sin',
	SINH = 'sinh',
	COS = 'cos',
	COSH = 'cosh',
	TAN = 'tan',
	TANH = 'tanh',
	HYPOT = 'hypot',
	TRUNC = 'trunc',
}

type Operator = {
	type: OperatorType;
	nodesCount: number;
	execute: (nodes: Array<AbstractMetaNode>) => number;
	print: (nodes: Array<AbstractMetaNode>) => string;
};

function createIfOperator(): Operator {
	const type = OperatorType.IF;

	return {
		type,
		nodesCount: 3,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [condition, nodeLeft, nodeRight] = nodes;

			if (condition.evaluate() > 0) {
				return nodeLeft.evaluate();
			}

			return nodeRight.evaluate();
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [condition, nodeLeft, nodeRight] = nodes;
			const value = `${type}(${condition.print()} then (${nodeLeft.print()}) else (${nodeRight.print()}))`;

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

function createGreaterEqOperator(): Operator {
	const type = OperatorType.GREATEREQ;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() >= nodeRight.evaluate() ? 1 : 0;

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createLessOperator(): Operator {
	const type = OperatorType.LESS;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() < nodeRight.evaluate() ? 1 : 0;

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createLessEqOperator(): Operator {
	const type = OperatorType.LESSEQ;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = nodeLeft.evaluate() <= nodeRight.evaluate() ? 1 : 0;

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

function creatPow3Operator(): Operator {
	const type = OperatorType.POW3;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.pow(node.evaluate(), 3);

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatExpOperator(): Operator {
	const type = OperatorType.EXP;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.exp(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatAbsOperator(): Operator {
	const type = OperatorType.ABS;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.abs(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatLogOperator(): Operator {
	const type = OperatorType.LOG;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.log(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatLog2Operator(): Operator {
	const type = OperatorType.LOG2;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.log2(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatLog10Operator(): Operator {
	const type = OperatorType.LOG10;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.log10(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatRoundOperator(): Operator {
	const type = OperatorType.ROUND;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.round(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function creatSignOperator(): Operator {
	const type = OperatorType.SIGN;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.sign(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createMaxOperator(): Operator {
	const type = OperatorType.MAX;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = Math.max(nodeLeft.evaluate(), nodeRight.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createMinOperator(): Operator {
	const type = OperatorType.MIN;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = Math.min(nodeLeft.evaluate(), nodeRight.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createSinOperator(): Operator {
	const type = OperatorType.SIN;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.sin(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createSinhOperator(): Operator {
	const type = OperatorType.SINH;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.sinh(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createCosOperator(): Operator {
	const type = OperatorType.COS;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.cos(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createCoshOperator(): Operator {
	const type = OperatorType.COSH;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.cosh(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createTanOperator(): Operator {
	const type = OperatorType.TAN;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.tan(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createTanhOperator(): Operator {
	const type = OperatorType.TANH;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.tanh(node.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = `${type}(${node.print()})`;

			return value;
		},
	};
}

function createHypotOperator(): Operator {
	const type = OperatorType.HYPOT;

	return {
		type,
		nodesCount: 2,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = Math.hypot(nodeLeft.evaluate(), nodeRight.evaluate());

			return value;
		},
		print: (nodes: Array<AbstractMetaNode>) => {
			const [nodeLeft, nodeRight] = nodes;
			const value = `${type}(${nodeLeft.print()}, ${nodeRight.print()})`;

			return value;
		},
	};
}

function createTruncOperator(): Operator {
	const type = OperatorType.TRUNC;

	return {
		type,
		nodesCount: 1,
		execute: (nodes: Array<AbstractMetaNode>) => {
			const [node] = nodes;
			const value = Math.trunc(node.evaluate());

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
