import React, { useEffect, useMemo } from 'react';

import { fix } from '@utils/math';
import { getUnixFromTimestamp } from '@utils/date';
import { AreaChart } from '@ui/kit/area-chart';
import { TradingTester as TradingTesterLib, TradingTesterConstructor, BalanceRecord } from '@core/trading/tester';

export type TradingTesterProps = {
	testerOptions: TradingTesterConstructor;
	balances: Array<BalanceRecord>;
};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { testerOptions, balances } = props;

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

	const series = useMemo(() => {
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
		<div>
			<AreaChart options={options as any} series={series} height={350} />
		</div>
	);
};

export { TradingTester };
