import { Bar, Deal } from '@core/trading/primitives';
import { TestMarket } from '@core/trading/market';
import { StrategyEnsemble } from '@core/trading/strategy';
import { TestSpotRiskManager, RiskBehaviour } from '@core/trading/risk';
import { TestTrader } from '@core/trading/trader';
import { TradingBot } from '@core/trading/bot';

export type TradingTesterConstructor = {
	balance: number;
	pair: string;
	bars: Array<Bar>;
	commission: number;
	riskBehaviour: RiskBehaviour;
	ensemble: StrategyEnsemble;
	onChangeBalance?: (x: BalanceRecord) => void;
};

class TradingTester {
	private balance: number;
	private pair: string;
	private bars: Array<Bar>;
	private commission = 0;
	private riskBehaviour: RiskBehaviour;
	private ensemble: StrategyEnsemble;
	private balanceRecords: Array<BalanceRecord> = [];
	private onChangeBalance: (x: BalanceRecord) => void;

	constructor(options: TradingTesterConstructor) {
		const { balance, pair, bars, commission, riskBehaviour, ensemble, onChangeBalance } = options;

		this.balance = balance;
		this.pair = pair;
		this.bars = bars;
		this.commission = commission;
		this.riskBehaviour = riskBehaviour;
		this.ensemble = ensemble;
		this.onChangeBalance = onChangeBalance || (() => {});
	}

	public run(): Promise<TradeStatistics> {
		return new Promise<TradeStatistics>(async resolve => {
			const { pair, bars, balance, commission, riskBehaviour, ensemble, balanceRecords, onChangeBalance } = this;
			const market = new TestMarket({ pair, bars });
			const manager = new TestSpotRiskManager({
				basisAssetBalance: balance,
				riskBehaviour,
				commission,
			});
			const trader = new TestTrader();
			const bot = new TradingBot({ pair, ensemble, manager, trader });
			const onDecision = async (deal: Deal | null) => {
				if (!deal) return;
				const balance = await manager.getCurrentBasisAssetBalance(deal.getPrice());
				const record: BalanceRecord = {
					value: balance,
					timestamp: deal.getTimestamp(),
				};
				balanceRecords.push(record);
				onChangeBalance(record);
			};

			bot.subscribe(onDecision);
			market.subscribe(bot);

			const tick = await market.start();
			const basisAssetBalance = await manager.getCurrentBasisAssetBalance(tick);

			resolve({
				basisAssetBalance,
				balanceRecords: this.balanceRecords,
			});
		});
	}
}

type TradeStatistics = {
	basisAssetBalance: number;
	balanceRecords: Array<BalanceRecord>;
};

export type BalanceRecord = {
	value: number;
	timestamp: number;
};

export { TradingTester };
