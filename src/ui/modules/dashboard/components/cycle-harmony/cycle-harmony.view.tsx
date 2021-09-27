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
	const { values, positiveTrendline, topTrendline, bottomTrendline } = bitcoinCycleHarmony(bars);
	const positiveTrendlineData = positiveTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const topTrendlineData = topTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const bottomTrendlineData = bottomTrendline.map(x => ({ x: x.time * 1000, y: x.value }));
	const valuesData = values.map(x => ({ x: x.time * 1000, y: x.value }));
	const series = [
		{
			name: 'Positive Trendline',
			data: positiveTrendlineData,
		},
		{
			name: 'Top Trendline',
			data: topTrendlineData,
		},
		{
			name: 'Bottom Trendline',
			data: bottomTrendlineData,
		},
		{
			name: 'Cycle harmony curve',
			data: valuesData,
		},
	];

	const options = {
		theme: {
			mode: 'dark',
		},
		chart: {
			background: theme.chart.candlestick.backgroundColor,
			zoom: {
				enabled: true,
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
			width: [2, 2, 2, 2],
			dashArray: [4, 4, 4, 0],
		},
		colors: ['#fff', '#EF476F', '#06D6A0', '#03A9F4'],
		xaxis: {
			type: 'datetime',
		},
		tooltip: {
			x: {
				show: true,
				format: 'dd MMM yyyy',
			},
		},
		annotations: {
			xaxis: [
				{
					x: new Date('9 Apr 2013').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: '#EF476F',
						style: {
							color: '#fff',
							background: '#EF476F',
						},
						text: 'middle top 2013',
					},
				},
				{
					x: new Date('29 Nov 2013').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: '#EF476F',
						style: {
							color: '#fff',
							background: '#EF476F',
						},
						text: 'top 2013',
					},
				},
				{
					x: new Date('14 Jan 2015').getTime(),
					strokeDashArray: 0,
					borderColor: '#06D6A0',
					label: {
						borderColor: '#06D6A0',
						style: {
							color: '#fff',
							background: '#06D6A0',
						},
						text: 'bottom 2015',
					},
				},
				{
					x: new Date('16 Dec 2017').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: '#EF476F',
						style: {
							color: '#fff',
							background: '#EF476F',
						},
						text: 'top 2017',
					},
				},
				{
					x: new Date('15 Dec 2018').getTime(),
					strokeDashArray: 0,
					borderColor: '#06D6A0',
					label: {
						borderColor: '#06D6A0',
						style: {
							color: '#fff',
							background: '#06D6A0',
						},
						text: 'bottom 2018',
					},
				},
				{
					x: new Date('13 Apr 2021').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: '#EF476F',
						style: {
							color: '#fff',
							background: '#EF476F',
						},
						text: 'middle top 2021',
					},
				},
			],
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
