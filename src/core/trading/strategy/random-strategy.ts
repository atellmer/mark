import { random } from '@utils/math';
import { Strategy, GetDecisionOptions, TradingDecision } from './strategy';

class RandomStrategy extends Strategy {
	public getDecision(options: GetDecisionOptions) {
		const { tick } = options;

		return new Promise<TradingDecision>(resolve => {
			const rand = random(0, 1);
			const decision = rand <= 0.2 ? TradingDecision.BUY : rand >= 0.8 ? TradingDecision.SELL : TradingDecision.KEEP;

			resolve(decision);
		});
	}
}

export { RandomStrategy };
