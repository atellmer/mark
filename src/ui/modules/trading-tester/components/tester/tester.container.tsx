import React, { useMemo, useState } from 'react';

import { Bar } from '@core/trading/primitives';
import { RiskBehaviour } from '@core/trading/risk';
import { TradingTesterConstructor, BalanceRecord } from '@core/trading/tester';
import { TradingTester as XTradingTester } from './tester.view';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

export type TradingTesterProps = {};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const [balances, setBalances] = useState<Array<BalanceRecord>>([]);
	const scope = useMemo(() => ({ balances }), []);

	const testerOptions: TradingTesterConstructor = useMemo(
		() => ({
			pair: 'btc_usdt',
			balance: 1000,
			commission: 1,
			bars: Bar.fromJSON(pricesdataset),
			riskBehaviour: RiskBehaviour.CONSERVATIVE,
			ensemble: new StrategyEnsemble([new RandomStrategy()]),
			dateRange: {
				dateStart: '01-01-2017 05:00:00',
				dateEnd: '01-09-2021 05:00:00',
			},
			onChangeBalance: balanceRecord => {
				setTimeout(() => {
					scope.balances.push(balanceRecord);
					setBalances([...scope.balances]);
				}, 1000);
			},
		}),
		[],
	);

	return <XTradingTester {...props} testerOptions={testerOptions} balances={balances} />;
};

export { TradingTester };