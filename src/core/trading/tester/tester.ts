import { Bar, Deal } from '@core/trading/primitives';
import { TestMarket } from '@core/trading/market';
import { StrategyEnsemble } from '@core/trading/strategy';
import { TestSpotRiskManager, RiskBehaviour } from '@core/trading/risk';
import { TestTrader } from '@core/trading/trader';
import { TradingBot } from '@core/trading/bot';

type TradingTesterConstructor = {
	balance: number;
	pair: string;
	bars: Array<Bar>;
	comission: number;
	riskBehaviour: RiskBehaviour;
	ensemble: StrategyEnsemble;
	dateRange: DateRange;
};

class TradingTester {
	private balance: number;
	private pair: string;
	private bars: Array<Bar>;
	private deals: Array<Deal> = [];
	private comission = 0;
	private riskBehaviour: RiskBehaviour;
	private ensemble: StrategyEnsemble;
	private dateRange: DateRange;

	constructor(options: TradingTesterConstructor) {
		const { balance, pair, bars, comission, riskBehaviour, ensemble, dateRange } = options;

		this.balance = balance;
		this.pair = pair;
		this.bars = bars;
		this.comission = comission;
		this.riskBehaviour = riskBehaviour;
		this.ensemble = ensemble;
		this.dateRange = dateRange;
	}

	public run(): Promise<TradeStatistics> {
		return new Promise<TradeStatistics>(async resolve => {
			const { pair, bars, balance, comission, riskBehaviour, ensemble, dateRange } = this;
			const market = new TestMarket({ pair, bars, dateRange });
			const manager = new TestSpotRiskManager({
				basisAssetBalance: balance,
				riskBehaviour,
				comission,
			});
			const trader = new TestTrader();
			const bot = new TradingBot({ pair, ensemble, manager, trader });

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
