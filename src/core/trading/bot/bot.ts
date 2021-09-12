import { extractTickerFromPair } from '@utils/trading';
import { MarketSubscriber, NotifyAboutLastTickOptions } from '@core/trading/market';
import { StrategyEnsemble, TradingDecision } from '@core/trading/strategy';
import { SpotRiskManager } from '@core/trading/risk';
import { Order, OrderType, OrderDirection, Deal } from '@core/trading/primitives';
import { Trader } from '@core/trading/trader';

type TradingBotConstructor = {
	pair: string;
	ensemble: StrategyEnsemble;
	manager: SpotRiskManager;
	trader: Trader;
};

class TradingBot implements MarketSubscriber {
	private pair: string;
	private ticker: string;
	private ensemble: StrategyEnsemble;
	private manager: SpotRiskManager;
	private trader: Trader;
	private subscribers: Array<Subscriber> = [];

	constructor(options: TradingBotConstructor) {
		const { pair, ensemble, manager, trader } = options;
		const ticker = extractTickerFromPair(pair);

		this.pair = pair;
		this.ticker = ticker;
		this.ensemble = ensemble;
		this.manager = manager;
		this.trader = trader;
	}

	public subscribe(subscriber: Subscriber) {
		const idx = this.subscribers.length;

		this.subscribers.push(subscriber);

		return () => {
			this.subscribers.splice(idx, 1);
		};
	}

	notifyAboutLastTick(options: NotifyAboutLastTickOptions): Promise<boolean> {
		return new Promise<boolean>(async resolve => {
			const { pair, tick, timestamp } = options;
			if (pair !== this.pair) return;
			const ticker = this.ticker;
			const price = tick;
			const decision = await this.ensemble.getDecision({ tick });
			const wantTrade = [TradingDecision.BUY, TradingDecision.SELL].includes(decision);
			let deal: Deal = null;

			if (wantTrade) {
				const riskParameters = await this.manager.calculateRiskParameters({ price, decision });
				const { canTakeRisk, quantity, stoploss, takeprofit } = riskParameters;

				if (canTakeRisk) {
					const type = OrderType.MARKET;
					const direction = getOrderDirection(decision);
					const order = new Order({ ticker, pair, direction, type, price, quantity, stoploss, takeprofit, timestamp });

					deal = await this.trader.execute(order);
					this.manager.onDeal(deal);
				}
			}

			for (const subscriber of this.subscribers) {
				subscriber(deal);
			}

			resolve(true);
		});
	}
}

type Subscriber = (deal: Deal) => void;

function getOrderDirection(decision: TradingDecision): OrderDirection {
	const map = {
		[TradingDecision.BUY]: OrderDirection.BUY,
		[TradingDecision.SELL]: OrderDirection.SELL,
	};

	return map[decision] || null;
}

export { TradingBot };
