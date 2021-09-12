import { MarketSubscriber, NotifyAboutLastTickOptions } from '@core/trading/market';
import { StrategyEnsemble, TradingDecision } from '@core/trading/strategy';
import { SpotRiskManager } from '@core/trading/risk';
import { Order, OrderType, OrderDirection, Deal } from '@core/trading/primitives';
import { Trader } from '@core/trading/trader';

class TradingBot implements MarketSubscriber {
	private pair: string;
	private ensemble: StrategyEnsemble;
	private manager: SpotRiskManager;
	private trader: Trader;
	private subscribers: Array<Subscriber> = [];

	constructor(pair: string, ensemble: StrategyEnsemble, manager: SpotRiskManager, trader: Trader) {
		this.pair = pair;
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

	async notifyAboutLastTick(options: NotifyAboutLastTickOptions) {
		const { pair, tick, timestamp } = options;
		if (pair !== this.pair) return;
		const subscribers = this.subscribers;
		const [ticker] = pair.split('_');
		const price = tick;
		const decision = await this.ensemble.getDecision({ tick });
		const wantTrade = [TradingDecision.BUY, TradingDecision.SELL].includes(decision);
		let deal: Deal = null;

		if (wantTrade) {
			const { canTakeRisk, quantity, stoploss, takeprofit } = await this.manager.calculateRiskParameters({
				ticker,
				price,
				decision,
			});

			if (canTakeRisk) {
				const type = OrderType.MARKET;
				const direction = getOrderDirection(decision);
				const order = new Order({ pair, direction, type, price, quantity, stoploss, takeprofit, timestamp });

				deal = await this.trader.execute(order);
			}
		}

		for (const subscriber of subscribers) {
			subscriber({ tick, deal });
		}
	}
}

type Subscriber = (x: SubscribeOptions) => void;

type SubscribeOptions = {
	tick: number;
	deal: Deal;
};

function getOrderDirection(decision: TradingDecision): OrderDirection {
	const map = {
		[TradingDecision.BUY]: OrderDirection.BUY,
		[TradingDecision.SELL]: OrderDirection.SELL,
	};

	return map[decision] || null;
}

export { TradingBot };
