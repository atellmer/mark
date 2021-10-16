import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { fairValueDeviation } from '@core/trading/indicators/fair-value-deviation';
import { Bar } from '@core/trading/primitives';
import { useTheme } from '@ui/theme';
import { Card } from '@ui/kit/card';
import pricesdataset from '@core/datasets/data/bars/investing/btc_usdt_d.json';
import { Root } from './styled';

export type FairValueDeviationProps = {};

const FairValueDeviation: React.FC<FairValueDeviationProps> = props => {
	const { theme } = useTheme();
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const { deviations, topTrendline, bottomTrendline } = useMemo(() => fairValueDeviation(bars), []);
	const deviationSeries = deviations.map(x => ({ x: x.time * 1000, y: x.value }));
	const topTrendlineData = topTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const bottomTrendlineData = bottomTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const series = [
		{
			name: 'top',
			data: topTrendlineData,
		},
		{
			name: 'bottom',
			data: bottomTrendlineData,
		},
		{
			name: 'Deviation curve',
			data: deviationSeries,
		},
	];

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
			text: 'Fair Value',
			align: 'left',
		},
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'straight',
			width: [3, 3, 3],
			dashArray: [4, 4, 0],
		},
		colors: ['#EF476F', '#06D6A0', '#03A9F4'],
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
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
				<ReactApexChart options={options as any} series={series} type='line' height={600} />
			</Card>
		</Root>
	);
};

export { FairValueDeviation };
