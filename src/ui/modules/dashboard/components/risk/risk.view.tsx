import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

import { risk } from '@core/trading/indicators/risk';
import { Bar } from '@core/trading/primitives';
import { Card } from '@ui/kit/card';
import { useTheme } from '@ui/theme';
import { Root } from './styled';
import pricesdataset from '@core/datasets/data/bars/investing/btc_usdt_d.json';

export type CycleHarmonyProps = {};

const Risk: React.FC<CycleHarmonyProps> = props => {
	const { theme } = useTheme();
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const { values, band } = risk(bars);
	const valuesData = values.map(x => ({ x: x.time * 1000, y: x.value }));
	const bandData = band.map(x => ({ x: x.time * 1000, y: x.value }));
	const series = [
		{
			name: 'Risk',
			data: valuesData,
		},
		// {
		// 	name: 'Band',
		// 	data: bandData,
		// },
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
			text: 'Bitcoin risk',
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
			width: [2],
			dashArray: [0],
		},
		colors: ['#fff'],
		xaxis: {
			type: 'datetime',
		},
		tooltip: {
			x: {
				show: true,
				format: 'dd MMM yyyy',
				// formatter: x => {
				// 	const date = moment(new Date(x)).format('DD MMMM YYYY');

				// 	console.log(`${date}: ${x}`);
				// 	return date;
				// },
			},
		},
		annotations: {
			xaxis: [
				{
					x: new Date('9 Apr 2013').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
						},
						text: 'middle top 2013',
					},
				},
				{
					x: new Date('29 Nov 2013').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
						},
						text: 'top 2013',
					},
				},
				{
					x: new Date('14 Jan 2015').getTime(),
					strokeDashArray: 0,
					borderColor: '#06D6A0',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
						},
						text: 'bottom 2015',
					},
				},
				{
					x: new Date('16 Dec 2017').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
						},
						text: 'top 2017',
					},
				},
				{
					x: new Date('15 Dec 2018').getTime(),
					strokeDashArray: 0,
					borderColor: '#06D6A0',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
						},
						text: 'bottom 2018',
					},
				},
				{
					x: new Date('13 Apr 2021').getTime(),
					strokeDashArray: 0,
					borderColor: '#EF476F',
					label: {
						borderColor: 'transparent',
						style: {
							color: '#fff',
							background: 'transparent',
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

export { Risk };
