import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { bitcoinCycleHarmony } from '@core/trading/indicators/bitcoin-cycle-harmony';
import { Bar } from '@core/trading/primitives';
import { Card } from '@ui/kit/card';
import { useTheme } from '@ui/theme';
import { Root } from './styled';
import pricesdataset from '@core/datasets/data/bars/investing/btc_usdt_d.json';

export type CycleHarmonyProps = {};

const CycleHarmony: React.FC<CycleHarmonyProps> = props => {
	const { theme } = useTheme();
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const { values, topTrendline, bottomTrendline } = bitcoinCycleHarmony(bars);
	const topTrendlineData = topTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const bottomTrendlineData = bottomTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const valuesData = values.map(x => ({ x: x.time * 1000, y: x.value }));
	const series = [
		{
			name: 'Top trendline',
			data: topTrendlineData,
		},
		{
			name: 'Cycle harmony curve',
			data: valuesData,
		},
		{
			name: 'Bottom trendline',
			data: bottomTrendlineData,
		},
	];

	const options = {
		theme: {
			mode: 'dark',
		},
		chart: {
			background: theme.chart.candlestick.backgroundColor,
			zoom: {
				enabled: false,
			},
		},
		title: {
			text: 'Bitcoin cycle harmony',
			align: 'left',
		},
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
		stroke: {
			curve: 'straight',
			width: [2, 2, 2],
			dashArray: [4, 0, 4],
		},
		colors: ['#EF476F', '#FFEB3B', '#06D6A0'],
		xaxis: {
			type: 'datetime',
		},
		tooltip: {
			x: {
				show: true,
				format: 'dd MMM yyyy',
			},
		},
	};

	return (
		<Root>
			<Card fullWidth>
				<ReactApexChart options={options as any} series={series} type='line' height={400} />
			</Card>
		</Root>
	);
};

export { CycleHarmony };
