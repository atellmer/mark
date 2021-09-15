import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

import { bitcoinPriceTemperature } from '@core/trading/indicators/bitcoin-price-temperature';
import { Bar } from '@core/trading/primitives';
import { Card } from '@ui/kit/card';
import { useTheme } from '@ui/theme';
import { Root } from './styled';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

export type PriceTemperatureProps = {};

const PriceTemperature: React.FC<PriceTemperatureProps> = props => {
	const bars = useMemo(() => Bar.fromJSON(pricesdataset), []);
	const temperatures = bitcoinPriceTemperature(bars);
	const { theme } = useTheme();

	const series = [
		{
			name: 'Price temperature',
			data: temperatures.map(x => ({ x: x.time * 1000, y: x.value })),
		},
	];
	const options = {
		theme: {
			mode: 'dark',
		},
		chart: {
			background: 'transparent',
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'straight',
		},
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
		},
		xaxis: {
			type: 'datetime',
		},
		colors: ['#4392F1'],
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
