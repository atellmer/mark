import { Strategy, GetDecisionOptions, TradingDecision } from './strategy';

class BoostingStrategy extends Strategy {
	public getDecision(options: GetDecisionOptions) {
		const { price } = options;

		return new Promise<TradingDecision>(resolve => {
			resolve(TradingDecision.BUY);
		});
	}
}

export { BoostingStrategy };
