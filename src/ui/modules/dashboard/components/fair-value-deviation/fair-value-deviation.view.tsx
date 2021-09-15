import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

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
	const deviations = fairValueDeviation(bars);
	const lastTime = deviations[deviations.length - 1].time;
	const shift = { x: moment.unix(lastTime).add(500, 'day').unix() * 1000, y: null };
	const deviationDeries = [...deviations.map(x => ({ x: x.time * 1000, y: x.value })), shift];
	const trendLineDateStart = moment('10-04-2013', 'DD-MM-YYYY').unix() * 1000;
	const trendLineDateEnd = moment('31-12-2023', 'DD-MM-YYYY').unix() * 1000;
	const series = [
		{
			name: 'Deviation curve',
			data: deviationDeries,
		},
		{
			name: 'top',
			data: [
				{ x: trendLineDateStart, y: 910 },
				{ x: trendLineDateEnd, y: 130 },
			],
		},
		{
			name: 'bottom',
			data: [
				{ x: trendLineDateStart, y: 50 },
				{ x: trendLineDateEnd, y: 50 },
			],
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
			dashArray: [0, 4, 4],
		},
		colors: ['#03A9F4', '#EF476F', '#06D6A0'],
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
