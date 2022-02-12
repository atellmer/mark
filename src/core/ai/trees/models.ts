import { Sample } from '@core/ai/sample';

export type DecisionTreeVariant = 'fit' | 'recovery';

export type DecisionTreeFitOptions = {
	variant: 'fit';
	samples: Array<Sample>;
	maxDepth?: number;
};

export type DecisionTreeRecoveryOptions = {
	variant: 'recovery';
	inlineEngine?: InlinePredictionEngine;
};

export type FeatureValue = string | number;

export type NodeType = 'parent' | 'leaf';

export type ParentDecisionNode<T> = {
	type: 'parent';
	featureIdx: number;
	threshold: FeatureValue;
	leftNode: T;
	rightNode: T;
};

export type LeafDecisionNode = {
	type: 'leaf';
	distribution: Record<string, number>;
};

export type Criteria = {
	featureIdx: number;
	threshold: FeatureValue;
};

export type InlineDecisionNode = {
	type: string;
	featureIdx: number;
	threshold: FeatureValue;
	leftNode: Partial<InlineDecisionNode>;
	rightNode: Partial<InlineDecisionNode>;
	distribution: Record<string, number>;
};

export type InlinePredictionEngine = {
	tree: Partial<InlineDecisionNode>;
};
