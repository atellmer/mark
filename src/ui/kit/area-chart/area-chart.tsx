import React, { useRef, useEffect, useLayoutEffect, useMemo, memo, forwardRef } from 'react';
import {
	createChart,
	ColorType,
	LineData,
	UTCTimestamp,
	LineWidth,
	MouseEventParams,
	IChartApi as ChartApi,
	ISeriesApi as SeriesApi,
} from 'lightweight-charts';
import useMeasure from 'react-use-measure';

import { fix } from '@utils/math';
import type { BalanceRecord } from '@core/trading/tester';
import { useTheme } from '@ui/theme';
import { Root } from './styled';

export type AreaChartProps = {
	name: string;
	height: number;
	data: Array<LineData>;
	fitContent?: boolean;
};

const AreaChart = memo(
	forwardRef<{}, AreaChartProps>((props, ref) => {
		const { height: inititalHeight, data, name, fitContent } = props;
		const containerRef = useRef<HTMLDivElement>();
		const chartRef = useRef<ChartApi>();
		const [measureRef, { width, height }] = useMeasure();
		const { theme } = useTheme();
		const scope: Scope = useMemo(() => ({ areaSeries: null }), []);

		const setContainerRef = (elementRef: HTMLDivElement) => {
			containerRef.current = elementRef;
			measureRef(elementRef);
		};

		useEffect(() => {
			chartRef.current = createChart(containerRef.current, {
				width,
				height: inititalHeight,
				layout: {
					background: {
						type: ColorType.Solid,
						color: theme.chart.candlestick.backgroundColor,
					},
					textColor: theme.palette.text,
				},
				grid: {
					vertLines: {
						color: theme.palette.stealth,
						style: 1,
						visible: true,
					},
					horzLines: {
						color: theme.palette.stealth,
						style: 1,
						visible: true,
					},
				},
				crosshair: {
					vertLine: {
						width: 5 as LineWidth,
						color: 'rgba(224, 227, 235, 0.1)',
						style: 0,
					},
					horzLine: {
						visible: false,
						labelVisible: false,
					},
				},
				kineticScroll: {
					mouse: true,
				},
			});
			const legend = createLegendElement(containerRef.current, name);

			scope.areaSeries = chartRef.current.addAreaSeries({});

			chartRef.current.subscribeCrosshairMove(param => {
				const value = param.seriesPrices.get(scope.areaSeries) || '';

				legend.innerHTML = `${name} ${value}`;
			});
		}, []);

		useEffect(() => {
			if (!scope.areaSeries) return;

			scope.areaSeries.setData(data);
			fitContent && chartRef.current.timeScale().fitContent();
		}, [data, fitContent]);

		useLayoutEffect(() => {
			if (!chartRef.current) return;
			chartRef.current.resize(width, height, true);
		}, [width, height]);

		return (
			<Root>
				<div ref={setContainerRef} />
			</Root>
		);
	}),
);

type Scope = {
	areaSeries: SeriesApi<'Area'>;
};

function createLegendElement(container: HTMLDivElement, text = '') {
	const legend = document.createElement('div');

	legend.classList.add('legend');
	legend.innerHTML = text;

	container.appendChild(legend);

	return legend;
}

function createAreaDataFromBalanceRecords(balanceRecords: Array<BalanceRecord>) {
	const data = balanceRecords.map(x => ({ time: x.timestamp as UTCTimestamp, value: fix(x.value, 2) }));

	return data;
}

export { AreaChart, createAreaDataFromBalanceRecords };
