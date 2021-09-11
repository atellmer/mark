import { MarketSubscriber, NotifyAboutLastTickOptions } from '@core/trading/market';
import { StrategyEnsemble, TradingDecision } from '@core/trading/strategy';
import { RiskManager } from '@core/trading/risk';
import { Order, OrderType, OrderDirection, Deal } from '@core/trading/primitives';
import { Trader } from '@core/trading/trader';

class TradingBot implements MarketSubscriber {
	private pair: string;
	private ensemble: StrategyEnsemble;
	private riskManager: RiskManager;
	private trader: Trader;
	private subscribers: Array<Subscriber> = [];

	constructor(pair: string, ensemble: StrategyEnsemble, riskManager: RiskManager, trader: Trader) {
		this.pair = pair;
		this.ensemble = ensemble;
		this.riskManager = riskManager;
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
		const decision = await this.ensemble.getDecision({ tick });
		const wantBuy = decision === TradingDecision.BUY;
		const wantSell = decision === TradingDecision.SELL;
		const wantTrade = wantBuy || wantSell;
		let deal: Deal = null;

		if (wantTrade) {
			const type = OrderType.MARKET;
			const direction = getOrderDirection(decision);
			const { amount, stopLoss, takeProfit } = await this.riskManager.getAvailableRisk(tick, decision);
			const order = new Order({ pair, timestamp, tick, stopLoss, takeProfit, type, direction, amount });

			deal = await this.trader.execute(order);
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
