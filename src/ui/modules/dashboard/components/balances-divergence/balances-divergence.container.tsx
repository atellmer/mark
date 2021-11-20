import React, { useState, useEffect } from 'react';

import { onchainApi } from '@core/api';
import {
	balancesDivergence as calculateBalancesDivergence,
	BalancesDivergenceIndicatorValue,
} from '@core/trading/indicators/balances-divergence';
import { BalancesDivergence as XBalancesDivergence } from './balances-divergence.view';

export type BalancesDivergenceProps = {};

const BalancesDivergence: React.FC<BalancesDivergenceProps> = props => {
	const [isFetching, setIsFetching] = useState(true);
	const [balancesDivergence, setBalancesDivergence] = useState<Array<BalancesDivergenceIndicatorValue>>([]);

	useEffect(() => {
		(async () => {
			const limit = 400;
			const [prices, distribution] = await Promise.all([
				onchainApi.fetchHistoricalPrices({ pair: 'BTC_USD', timeframe: 'D', limit }),
				onchainApi.fetchBalanceDistribution({ limit }),
			]);
			const value = calculateBalancesDivergence(prices, distribution);

			setBalancesDivergence(value);
			setIsFetching(false);
		})();
	}, []);

	return <XBalancesDivergence isFetching={isFetching} balancesDivergence={balancesDivergence} />;
};

export { BalancesDivergence };
