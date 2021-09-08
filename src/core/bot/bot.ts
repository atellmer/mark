import { StrategyAnsible, TradingDecision } from '../strategy';
import { Trader, MakeOrderOptions } from '../trader';
import { MarketSubscriber, Price, OrderType } from '../market';
import { MoneyManagement } from '../money';

class Bot implements MarketSubscriber {
	symbol: string;
	ansible: StrategyAnsible;
	trader: Trader;
	moneyManagement: MoneyManagement;

	constructor(symbol: string, ansible: StrategyAnsible, trader: Trader, moneyManagement: MoneyManagement) {
		this.symbol = symbol;
		this.ansible = ansible;
		this.trader = trader;
		this.moneyManagement = moneyManagement;
	}

	async notify(price: Price) {
		const decision = await this.ansible.getDecision({ price });
		const hasDeal = [TradingDecision.BUY, TradingDecision.SELL].includes(decision);

		if (hasDeal) {
			const { amount, stopLoss, takeProfit } = await this.moneyManagement.getOrderParameters(price, decision);
			const options: MakeOrderOptions = {
				symbol: this.symbol,
				type: OrderType.MARKET,
				amount,
				stopLoss,
				takeProfit,
				currentPrice: price.close,
			};

			if (decision === TradingDecision.BUY) {
				await this.trader.buy(options);
			} else if (decision === TradingDecision.SELL) {
				await this.trader.sell(options);
			}
		}
	}
}

export { Bot };
