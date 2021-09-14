import React, { useMemo, useState, useEffect } from 'react';

import { filterBars } from '@utils/trading';
import { Bar } from '@core/trading/primitives';
import { RiskBehaviour } from '@core/trading/risk';
import { TradingTester as TradingTesterLib, BalanceRecord } from '@core/trading/tester';
import { TradingTester as XTradingTester } from './tester.view';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

export type TradingTesterProps = {};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const [balanceRecords, setBalanceRecords] = useState<Array<BalanceRecord>>([]);
	const dateRange: DateRange = {
		dateStart: '01-01-2017 05:00:00',
		dateEnd: '01-09-2021 05:00:00',
	};
	const bars = useMemo(() => filterBars(Bar.fromJSON(pricesdataset), dateRange), []);

	useEffect(() => {
		(async () => {
			const tester = new TradingTesterLib({
				pair: 'btc_usdt',
				balance: 1000,
				commission: 1,
				bars,
				riskBehaviour: RiskBehaviour.CONSERVATIVE,
				ensemble: new StrategyEnsemble([new RandomStrategy()]),
			});
			const { basisAssetBalance, balanceRecords } = await tester.run();
			const buffer = [];
			const update = (balanceRecord: BalanceRecord) => {
				buffer.push(balanceRecord);
				setBalanceRecords([...buffer]);

				if (balanceRecords[buffer.length + 1]) {
					setTimeout(() => {
						update(balanceRecords[buffer.length + 1]);
					}, UPDATE_INTERVAL);
				}
			};

			console.log('balance', basisAssetBalance);

			update(balanceRecords[0]);
		})();
	}, []);

	return <XTradingTester {...props} balanceRecords={balanceRecords} bars={bars} />;
};

const UPDATE_INTERVAL = 100;

export { TradingTester };
