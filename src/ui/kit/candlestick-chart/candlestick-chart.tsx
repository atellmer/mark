import React, { useMemo, memo } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

import { getUnixFromTimestamp } from '@utils/date';
import { Bar } from '@core/trading/primitives';
import { useTheme } from '@ui/theme';
import { Box } from '@ui/kit/box';

export type CandlestickChartProps = {
	bars: Array<Bar>;
	height: number;
	options?: Partial<ApexOptions>;
};

const CandlestickChart: React.FC<CandlestickChartProps> = memo(props => {
	const { height, bars, options } = props;
	const { theme } = useTheme();

	const priceSeries = useMemo(() => {
		const data = bars.map(x => [
			getUnixFromTimestamp(x.getTimestamp()),
			x.getOpen(),
			x.getHight(),
			x.getLow(),
			x.getClose(),
		]);

		return [
			{
				name: 'Price',
				data,
			},
		];
	}, [bars]);

	const mergedOptions = useMemo(
		() => ({
			theme: {
				mode: 'dark',
			},
			chart: {
				type: 'candlestick',
				width: '100%',
				id: 'candles',
				background: '#1D3051',
				toolbar: {
					autoSelected: 'pan',
					show: false,
				},
				zoom: {
					enabled: false,
				},
				animations: {
					enabled: false,
				},
			},
			xaxis: {
				type: 'datetime',
				labels: {
					show: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			markers: {
				size: 0,
				style: 'hollow',
			},
			grid: {
				show: true,
				borderColor: theme.palette.stealth,
				xaxis: {
					lines: {
						show: true,
					},
				},
				yaxis: {
					lines: {
						show: true,
					},
				},
			},
			...options,
		}),
		[],
	);

	const volumeSeries = useMemo(() => {
		const data = bars.map(x => [getUnixFromTimestamp(x.getTimestamp()), x.getVolume()]);

		return [
			{
				name: 'Volume',
				data,
			},
		];
	}, [bars]);

	const barOptions = {
		theme: {
			mode: 'dark',
		},
		chart: {
			type: 'bar',
			brush: {
				enabled: true,
				target: 'candles',
			},
			background: '#1D3051',
			selection: {
				enabled: true,
				xaxis: {
					min: bars[bars.length - 300] ? bars[bars.length - 300].getTimestamp() * 1000 : 0,
					max: bars[bars.length - 1].getTimestamp() * 1000,
				},
				fill: {
					color: '#ccc',
					opacity: 0.4,
				},
				stroke: {
					color: '#0D47A1',
				},
			},
			animations: {
				enabled: false,
			},
		},
		grid: {
			show: true,
			borderColor: theme.palette.stealth,
			xaxis: {
				lines: {
					show: true,
				},
			},
			yaxis: {
				lines: {
					show: true,
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			bar: {
				columnWidth: '80%',
			},
		},
		stroke: {
			width: 0,
		},
		xaxis: {
			type: 'datetime',
			axisBorder: {
				offsetX: 13,
			},
			labels: {
				show: true,
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
	};

	return (
		<Box>
			<ReactApexChart options={mergedOptions as any} series={priceSeries} type='candlestick' height={height} />
			<Box marginTop={-24}>
				<ReactApexChart options={barOptions as any} series={volumeSeries} type='bar' height={120} />
			</Box>
		</Box>
	);
});

export { CandlestickChart };
