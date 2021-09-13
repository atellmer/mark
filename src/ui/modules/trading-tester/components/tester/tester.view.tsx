import React, { useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { fix } from '@utils/math';
import { useTheme } from '@ui/theme';
import { TradingTester as TradingTesterLib, TradingTesterConstructor, BalanceRecord } from '@core/trading/tester';

export type TradingTesterProps = {
	testerOptions: TradingTesterConstructor;
	balances: Array<BalanceRecord>;
};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { testerOptions, balances } = props;
	const { theme } = useTheme();

	useEffect(() => {
		(async () => {
			const tester = new TradingTesterLib(testerOptions);
			const { basisAssetBalance } = await tester.run();

			console.log('balance', basisAssetBalance);
		})();
	}, []);

	const options = useMemo(
		() => ({
			theme: {
				mode: 'dark',
			},
			chart: {
				type: 'area',
				height: 350,
				background: '#1D3051',
				zoom: {
					autoScaleYaxis: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			markers: {
				size: 0,
				style: 'hollow',
			},
			xaxis: {
				type: 'datetime',
				//min: new Date('01 Mar 2012').getTime(),
				tickAmount: 6,
			},
			tooltip: {
				x: {
					format: 'dd MMM yyyy',
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100],
				},
			},
			grid: {
				show: true,
				borderColor: theme.palette.stealth,
			},
		}),
		[],
	);

	const series = useMemo(() => {
		const data = balances.map(x => [x.timestamp * 1000, fix(x.value, 2)]);

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
			<ReactApexChart options={options as any} series={series} type='area' height={350} />
		</div>
	);
};

export { TradingTester };
