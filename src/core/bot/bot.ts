import { StrategyAnsible, TradingDecision } from '../strategy';
import { Trader } from '../trader';
import { MarketSubscriber, Price, OrderType } from '../market';

class Bot implements MarketSubscriber {
	ansible: StrategyAnsible;
	trader: Trader;

	constructor(ansible: StrategyAnsible, trader: Trader) {
		this.ansible = ansible;
		this.trader = trader;
	}

	async notify(price: Price) {
		const decision = await this.ansible.getDecision({ price });

		if (decision === TradingDecision.BUY) {
			await this.trader.buy({ amount: 1000, type: OrderType.MARKET });
		} else if (decision === TradingDecision.SELL) {
			await this.trader.sell({ amount: 1000, type: OrderType.MARKET });
		}
	}
}

export { Bot };
