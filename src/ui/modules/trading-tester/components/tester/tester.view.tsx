import React, { useEffect, useMemo } from 'react';

import { fix } from '@utils/math';
import { getUnixFromTimestamp } from '@utils/date';
import { Bar } from '@core/trading/primitives';
import { CandlestickChart } from '@ui/kit/candlestick-chart';
import { AreaChart } from '@ui/kit/area-chart';
import { Card } from '@ui/kit/card';
import { TradingTester as TradingTesterLib, TradingTesterConstructor, BalanceRecord } from '@core/trading/tester';
import { Root } from './styled';

export type TradingTesterProps = {
	testerOptions: TradingTesterConstructor;
	balances: Array<BalanceRecord>;
	bars: Array<Bar>;
};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { testerOptions, balances, bars } = props;

	useEffect(() => {
		(async () => {
			const tester = new TradingTesterLib(testerOptions);
			const { basisAssetBalance } = await tester.run();

			console.log('balance', basisAssetBalance);
		})();
	}, []);

	const options = useMemo(
		() => ({
			xaxis: {
				type: 'datetime',
				tickAmount: 6,
			},
			tooltip: {
				x: {
					format: 'dd MMM yyyy',
				},
			},
		}),
		[],
	);

	const areaSeries = useMemo(() => {
		const data = balances.map(x => [getUnixFromTimestamp(x.timestamp), fix(x.value, 2)]);

		return [
			{
				name: 'Equity',
				color: '#00C2FB',
				data,
			},
		];
	}, [balances]);

	return (
		<Root>
			<Card marginBottom={10} fullWidth>
				<CandlestickChart bars={bars} height={240} />
			</Card>
			<Card fullWidth>
				<AreaChart options={options as any} series={areaSeries} height={300} />
			</Card>
		</Root>
	);
};

export { TradingTester };
