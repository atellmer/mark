import { Bar } from '@core/trading/primitives';
import { RiskBehaviour } from '@core/trading/risk';
import { TradingTester } from '@core/trading/tester';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

(async () => {
	const tester = new TradingTester({
		pair: 'btc_usdt',
		balance: 1000,
		comission: 1,
		bars: Bar.fromJSON(pricesdataset),
		riskBehaviour: RiskBehaviour.CONSERVATIVE,
		ensemble: new StrategyEnsemble([new RandomStrategy()]),
		dateRange: {
			dateStart: '01-01-2021 05:00:00',
			dateEnd: '01-09-2021 05:00:00',
		},
	});
	const { basisAssetBalance } = await tester.run();

	console.log('balance', basisAssetBalance);
})();
