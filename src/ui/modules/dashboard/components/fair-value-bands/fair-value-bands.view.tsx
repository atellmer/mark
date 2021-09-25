import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

import { fairValueBands } from '@core/trading/indicators/fair-value-bands';
import { Bar } from '@core/trading/primitives';
import { useTheme } from '@ui/theme';
import { Card } from '@ui/kit/card';
import pricesdataset from '@core/datasets/data/bars/investing/btc_usdt_d.json';
import { Root } from './styled';

export type FairValueBandsProps = {};

const FairValueBands: React.FC<FairValueBandsProps> = props => {
	const { theme } = useTheme();
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const { pricePoints, middleBandPoints, topBandPoints, bottomBandPoints } = useMemo(() => fairValueBands(bars), []);
	const lastTime = pricePoints[pricePoints.length - 1].time;
	const shift = { x: moment.unix(lastTime).add(500, 'day').unix() * 1000, y: null };
	const priceSeries = [...pricePoints.map(x => ({ x: x.time * 1000, y: x.value })), shift];
	const middleBandSeries = [...middleBandPoints.map(x => ({ x: x.time * 1000, y: x.value })), shift];
	const topBandSeries = [...topBandPoints.map(x => ({ x: x.time * 1000, y: x.value })), shift];
	const bottomBandSeries = [...bottomBandPoints.map(x => ({ x: x.time * 1000, y: x.value })), shift];

	const series = [
		{
			name: 'Price',
			data: priceSeries,
		},
		{
			name: 'Top Band',
			data: topBandSeries,
		},
		{
			name: 'Middle Band',
			data: middleBandSeries,
		},
		{
			name: 'Bottom Band',
			data: bottomBandSeries,
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
			text: 'Fair Value Bands',
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
			width: [3, 2, 2, 2],
			dashArray: [0, 4, 4, 4],
		},
		colors: ['#03A9F4', '#EF476F', '#FFEB3B', '#06D6A0'],
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
		yaxis: {
			logarithmic: true,
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

export { FairValueBands };
