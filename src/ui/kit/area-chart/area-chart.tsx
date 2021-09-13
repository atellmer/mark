import React, { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

import { useTheme } from '@ui/theme';

export type AreaChartProps = {
	height: number;
	options?: Partial<ApexOptions>;
	series: Array<{ data: Array<any> }>;
};

const AreaChart: React.FC<AreaChartProps> = props => {
	const { height, series, options } = props;
	const { theme } = useTheme();
	const mergedOptions = useMemo(
		() => ({
			theme: {
				mode: 'dark',
			},
			chart: {
				type: 'area',
				height,
				background: '#1D3051',
				zoom: {
					autoScaleYaxis: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			markers: {
				size: 0,
				style: 'hollow',
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100],
				},
			},
			grid: {
				show: true,
				borderColor: theme.palette.stealth,
			},
			...options,
		}),
		[],
	);

	return <ReactApexChart options={mergedOptions as any} series={series} type='area' height={height} />;
};

export { AreaChart };
