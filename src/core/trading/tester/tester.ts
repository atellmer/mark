import { Bar, Deal } from '@core/trading/primitives';
import { TestMarket } from '@core/trading/market';
import { TradingDecision, StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import { TestSpotRiskManager, RiskStyle } from '@core/trading/risk';
import { TestTrader } from '@core/trading/trader';
import { TradingBot } from '@core/trading/bot';

class TradingTester {
	private initialBalance: number;
	private currentBalance: number;
	private pair: string;
	private bars: Array<Bar>;
	private deals: Array<Deal> = [];

	constructor(options: TradingTesterOptions) {
		const { initialBalance, pair, bars } = options;

		this.initialBalance = initialBalance;
		this.currentBalance = initialBalance;
		this.pair = pair;
		this.bars = bars;
	}

	public run(): Promise<TradeStatistics> {
		return new Promise<TradeStatistics>(resolve => {
			const pair = this.pair;
			const bars = this.bars;
			const initialBalance = this.initialBalance;
			const market = new TestMarket(pair, bars);
			const ensemble = new StrategyEnsemble([new RandomStrategy()]);
			const manager = new TestSpotRiskManager({
				style: RiskStyle.CONSERVATIVE,
				balance: initialBalance,
				commision: 0.1,
			});
			const trader = new TestTrader();
			const bot = new TradingBot(pair, ensemble, manager, trader);

			bot.subscribe(({ tick, deal }) => {
				if (deal) {
					this.deals.push(deal);
				}
			});

			market.subscribe(bot);
			market.start();

			resolve(null);
		});
	}
}

type TradeStatistics = {
	balance: number;
};

type TradingTesterOptions = {
	initialBalance: number;
	pair: string;
	bars: Array<Bar>;
};

export { TradingTester };
