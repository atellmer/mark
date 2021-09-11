export interface DecisionMaker {
	getDecision: (options: GetDecisionOptions) => Promise<TradingDecision>;
}

abstract class Strategy implements DecisionMaker {
	public abstract getDecision(options: GetDecisionOptions): Promise<TradingDecision>;
}

export type GetDecisionOptions = {
	tick: number;
};

export enum TradingDecision {
	BUY = 'buy',
	SELL = 'sell',
	KEEP = 'keep',
}

export { Strategy };
