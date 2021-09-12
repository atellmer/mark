import { Bar, Deal } from '@core/trading/primitives';
import { TestMarket } from '@core/trading/market';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import { TestSpotRiskManager, RiskStyle } from '@core/trading/risk';
import { TestTrader } from '@core/trading/trader';
import { TradingBot } from '@core/trading/bot';

type TradingTesterConstructor = {
	balance: number;
	pair: string;
	bars: Array<Bar>;
	comission: number;
};

class TradingTester {
	private balance: number;
	private pair: string;
	private bars: Array<Bar>;
	private deals: Array<Deal> = [];
	private comission = 0;

	constructor(options: TradingTesterConstructor) {
		const { balance, pair, bars, comission } = options;

		this.balance = balance;
		this.pair = pair;
		this.bars = bars;
		this.comission = comission;
	}

	public run(): Promise<TradeStatistics> {
		return new Promise<TradeStatistics>(async resolve => {
			const pair = this.pair;
			const bars = this.bars;
			const balance = this.balance;
			const comission = this.comission;
			const market = new TestMarket(pair, bars);
			const ensemble = new StrategyEnsemble([new RandomStrategy()]);
			const manager = new TestSpotRiskManager({
				style: RiskStyle.CONSERVATIVE,
				basisAssetBalance: balance,
				comission,
			});
			const trader = new TestTrader();
			const bot = new TradingBot(pair, ensemble, manager, trader);

			bot.subscribe(deal => deal && this.deals.push(deal));
			market.subscribe(bot);

			const tick = await market.start();
			const basisAssetBalance = await manager.getCurrentBasisAssetBalance(tick);

			resolve({
				basisAssetBalance,
			});
		});
	}
}

type TradeStatistics = {
	basisAssetBalance: number;
};

export { TradingTester };
