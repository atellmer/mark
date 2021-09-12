import { Bar, Deal } from '@core/trading/primitives';
import { TestMarket } from '@core/trading/market';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import { TestSpotRiskManager, RiskStyle } from '@core/trading/risk';
import { TestTrader } from '@core/trading/trader';
import { TradingBot } from '@core/trading/bot';

class TradingTester {
	private balance: number;
	private pair: string;
	private bars: Array<Bar>;
	private deals: Array<Deal> = [];

	constructor(options: TradingTesterOptions) {
		const { balance, pair, bars } = options;

		this.balance = balance;
		this.pair = pair;
		this.bars = bars;
	}

	public run(): Promise<TradeStatistics> {
		return new Promise<TradeStatistics>(async resolve => {
			const pair = this.pair;
			const bars = this.bars;
			const balance = this.balance;
			const market = new TestMarket(pair, bars);
			const ensemble = new StrategyEnsemble([new RandomStrategy()]);
			const manager = new TestSpotRiskManager({
				style: RiskStyle.CONSERVATIVE,
				balance,
				commision: 0.1,
			});
			const trader = new TestTrader();
			const bot = new TradingBot(pair, ensemble, manager, trader);

			bot.subscribe(deal => deal && this.deals.push(deal));
			market.subscribe(bot);

			const tick = await market.start();
			const currentBalance = manager.getCurrentBalance(tick);

			console.log('currentBalance', currentBalance);

			resolve({
				currentBalance,
			});
		});
	}
}

type TradeStatistics = {
	currentBalance: number;
};

type TradingTesterOptions = {
	balance: number;
	pair: string;
	bars: Array<Bar>;
};

export { TradingTester };
