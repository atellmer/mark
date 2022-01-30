import { randomInt } from '@utils/math';
import { AbstractMetaNode, MetaContext } from './shared';

class ConstantNode extends AbstractMetaNode {
	private value: number;
	private error: number = null;

	constructor(value: number) {
		super();
		this.value = value;
	}

	public setError(error: number) {
		this.error = error;
	}

	public getError(): number {
		return this.error;
	}

	public evaluate(): number {
		return this.value;
	}

	public print(): string {
		return `${this.value}`;
	}

	public clone(): ConstantNode {
		const node = new ConstantNode(this.value);

		node.setError(this.error);

		return node;
	}

	public mutate(): void {
		const node = ConstantNode.createRandomNode();

		this.value = node.value;
		this.error = null;
	}

	public static createRandomNode() {
		const { searchSpace } = MetaContext.extract();
		const [min, max] = searchSpace;
		const value = randomInt(min, max);

		return new ConstantNode(value);
	}
}

export { ConstantNode };
