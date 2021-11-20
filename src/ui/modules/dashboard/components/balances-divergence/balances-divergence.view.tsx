import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { BalancesDivergenceIndicatorValue } from '@core/trading/indicators/balances-divergence';
import { Card } from '@ui/kit/card';
import { useTheme } from '@ui/theme';
import { Root } from './styled';

export type BalancesDivergenceProps = {
	isFetching: boolean;
	balancesDivergence: Array<BalancesDivergenceIndicatorValue>;
};

const BalancesDivergence: React.FC<BalancesDivergenceProps> = props => {
	const { isFetching, balancesDivergence } = props;
	const { theme } = useTheme();
	const series = useMemo(() => {
		if (isFetching) return [];
		return [
			{
				name: 'Whales Buy and Fishes Sell',
				data: balancesDivergence.map(x => {
					return {
						x: x.time,
						y: x.isWhalesUpAndFishesDown ? x.value : null,
					};
				}),
			},
			{
				name: 'Whales Buy and Fishes Buy',
				data: balancesDivergence.map(x => {
					return {
						x: x.time,
						y: x.isWhalesUpAndFishesUp ? x.value : null,
					};
				}),
			},
			{
				name: 'Whales Sell and Fishes Buy',
				data: balancesDivergence.map(x => {
					return {
						x: x.time,
						y: x.isWhalesDownAndFishesUp ? x.value : null,
					};
				}),
			},
			{
				name: 'Whales Sell and Fishes Down',
				data: balancesDivergence.map(x => {
					return {
						x: x.time,
						y: x.isWhalesDownAndFishesDown ? x.value : null,
					};
				}),
			},
		];
	}, [isFetching]);

	const options = {
		theme: {
			mode: 'dark',
		},
		chart: {
			background: 'transparent',
			zoom: {
				enabled: true,
			},
		},
		title: {
			text: 'Bitcoin Balances Divergence',
			align: 'left',
		},
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		colors: ['#03A9F4', '#28C76F', '#FF9800', '#F44336'],
		markers: {
			size: [4],
		},
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
		xaxis: {
			type: 'datetime',
		},
		yaxis: {
			logarithmic: false,
		},
	};

	return (
		<Root>
			<Card fullWidth>
				{isFetching ? (
					<div>loading...</div>
				) : (
					<ReactApexChart options={options as any} series={series} type='scatter' height={600} />
				)}
			</Card>
		</Root>
	);
};

export { BalancesDivergence };
