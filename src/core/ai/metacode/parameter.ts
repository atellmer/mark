import { randomInt } from '@utils/math';
import { AbstractMetaNode, MetaContext } from './shared';

class ParameterNode extends AbstractMetaNode {
	private idx: number;
	private error: number = null;

	constructor(idx: number) {
		super();
		this.idx = idx;
		const { sampleLength } = MetaContext.extract();

		if (idx < 0 || idx > sampleLength - 1) {
			throw new Error('idx is out of range!');
		}
	}

	public setError(error: number) {
		this.error = error;
	}

	public getError(): number {
		return this.error;
	}

	public evaluate(): number {
		const { pattern } = MetaContext.extract();

		return pattern[this.idx];
	}

	public print(): string {
		return `x${this.idx}`;
	}

	public clone(): ParameterNode {
		const node = new ParameterNode(this.idx);

		node.setError(this.error);

		return node;
	}

	public mutate(): void {
		const { sampleLength } = MetaContext.extract();
		const node = ParameterNode.createRandomNode();

		if (this.idx === node.idx && sampleLength > 1) return this.mutate();

		this.idx = node.idx;
		this.error = null;
	}

	public static createRandomNode() {
		const { sampleLength } = MetaContext.extract();
		const idx = randomInt(0, sampleLength - 1);

		return new ParameterNode(idx);
	}
}

export { ParameterNode };
