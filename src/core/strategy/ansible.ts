import { Strategy, TradingDecision, DecisionMaker, GetDecisionOptions } from './strategy';

class StrategyAnsible implements DecisionMaker {
	private startegies: Array<Strategy> = [];

	constructor(startegies: Array<Strategy>) {
		this.startegies = startegies;
	}

	getDecision(options: GetDecisionOptions): Promise<TradingDecision> {
		return new Promise<TradingDecision>(async resolve => {
			const decisions = await Promise.all(this.startegies.map(x => x.getDecision(options)));
			const buyWeight = decisions.filter(x => x === TradingDecision.BUY).length;
			const sellWeight = decisions.filter(x => x === TradingDecision.SELL).length;
			const keepWeight = decisions.filter(x => x === TradingDecision.KEEP).length;
			let decision: TradingDecision = null;

			if (buyWeight > sellWeight + keepWeight) {
				decision = TradingDecision.BUY;
			} else if (sellWeight > buyWeight + keepWeight) {
				decision = TradingDecision.SELL;
			} else {
				decision = TradingDecision.KEEP;
			}

			resolve(decision);
		});
	}
}

export { StrategyAnsible };
