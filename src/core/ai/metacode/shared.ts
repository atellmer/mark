import { Sample } from '../sample';

abstract class AbstractMetaNode {
	public abstract setError(error: number);
	public abstract getError(): number;
	public abstract evaluate(): number;
	public abstract print(): string;
	public abstract clone(): AbstractMetaNode;
	public abstract mutate(prob?: number): void;
}

export type MetaContextOptions = {
	sampleLength: number;
	searchSpace: [number, number];
	parameterNodeProp: number;
	constantNodeProp: number;
	maxDepth: number;
	pattern?: Array<number>;
};

type Context = MetaContextOptions;

class MetaContext {
	private static sampleLength: number;
	private static searchSpace: [number, number];
	private static parameterNodeProp: number;
	private static constantNodeProp: number;
	private static maxDepth: number;
	private static pattern: Array<number>;

	public static init(options: MetaContextOptions) {
		const { sampleLength, searchSpace, parameterNodeProp, constantNodeProp, maxDepth } = options;

		MetaContext.sampleLength = sampleLength;
		MetaContext.searchSpace = searchSpace;
		MetaContext.parameterNodeProp = parameterNodeProp;
		MetaContext.constantNodeProp = constantNodeProp;
		MetaContext.maxDepth = maxDepth;
	}

	public static setPattern(pattern: Array<number>) {
		this.pattern = pattern;
	}

	public static extract(): Context {
		return {
			sampleLength: MetaContext.sampleLength,
			searchSpace: MetaContext.searchSpace,
			parameterNodeProp: MetaContext.parameterNodeProp,
			constantNodeProp: MetaContext.constantNodeProp,
			maxDepth: MetaContext.maxDepth,
			pattern: MetaContext.pattern,
		};
	}
}

export { AbstractMetaNode, MetaContext };
