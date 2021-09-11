import { Bar } from '@core/trading/primitives';
import { TradingTester } from '@core/trading/tester';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

(async () => {
	const bars = Bar.fromJSON(pricesdataset);
	const tester = new TradingTester({ initialBalance: 1000, bars, pair: 'btc_usdt' });

	await tester.run();
})();
