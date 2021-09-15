import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { bitcoinPriceTemperature } from '@core/trading/indicators/bitcoin-price-temperature';
import { Bar } from '@core/trading/primitives';
import { Card } from '@ui/kit/card';
import { useTheme } from '@ui/theme';
import { Root } from './styled';
import pricesdataset from '@core/datasets/data/bars/investing/btc_usdt_d.json';

export type PriceTemperatureProps = {};

const PriceTemperature: React.FC<PriceTemperatureProps> = props => {
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const temperatures = bitcoinPriceTemperature(bars);
	const { theme } = useTheme();
	const temperatureSeriesData = temperatures.map(x => ({ x: x.time * 1000, y: x.value }));
	const [firstPoint] = temperatureSeriesData;
	const lastPoint = temperatureSeriesData[temperatureSeriesData.length - 1];
	const series = [
		{
			name: 'Price temperature curve',
			data: temperatureSeriesData,
		},
		{
			name: 'StrongSell',
			data: [
				{ x: firstPoint.x, y: 8 },
				{ x: lastPoint.x, y: 8 },
			],
		},
		{
			name: 'Sell',
			data: [
				{ x: firstPoint.x, y: 6 },
				{ x: lastPoint.x, y: 6 },
			],
		},
		{
			name: 'Buy',
			data: [
				{ x: firstPoint.x, y: 2 },
				{ x: lastPoint.x, y: 2 },
			],
		},
		{
			name: 'StrongBuy',
			data: [
				{ x: firstPoint.x, y: 0 },
				{ x: lastPoint.x, y: 0 },
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
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'straight',
			width: [5, 3, 3, 3, 3],
			dashArray: [0, 4, 4, 4, 4],
		},
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
		xaxis: {
			type: 'datetime',
		},
		fill: {
			type: 'gradient',
			gradient: {
				type: 'vertical',
				colorStops: [
					{
						offset: 0,
						color: '#F44336',
						opacity: 1,
					},
					{
						offset: 20,
						color: '#FF9800',
						opacity: 1,
					},
					{
						offset: 40,
						color: '#FFEB3B',
						opacity: 1,
					},
					{
						offset: 60,
						color: '#CDDC39',
						opacity: 1,
					},
					{
						offset: 80,
						color: '#4CAF50',
						opacity: 1,
					},
					{
						offset: 100,
						color: '#03A9F4',
						opacity: 1,
					},
				],
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

export { PriceTemperature };
