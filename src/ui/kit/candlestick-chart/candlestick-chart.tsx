import React, { useRef, useEffect, useLayoutEffect, useMemo, memo, forwardRef } from 'react';
import {
	createChart,
	ColorType,
	BarData,
	HistogramData,
	UTCTimestamp,
	IChartApi as ChartApi,
	ISeriesApi as SeriesApi,
} from 'lightweight-charts';
import useMeasure from 'react-use-measure';

import type { Bar } from '@core/trading/primitives/bar';
import { useTheme } from '@ui/theme';
import { Root } from './styled';

export type CandlestickChartProps = {
	name: string;
	height: number;
	priceData: Array<BarData>;
	volumeData: Array<HistogramData>;
	fitContent?: boolean;
};

const CandlestickChart = memo(
	forwardRef<{}, CandlestickChartProps>((props, ref) => {
		const { name, height: inititalHeight, priceData, volumeData, fitContent } = props;
		const containerRef = useRef<HTMLDivElement>();
		const chartRef = useRef<ChartApi>();
		const [measureRef, { width, height }] = useMeasure();
		const { theme } = useTheme();
		const scope: Scope = useMemo(() => ({ candlestickSeries: null, histogramSeries: null }), []);

		const setContainerRef = (elementRef: HTMLDivElement) => {
			containerRef.current = elementRef;
			measureRef(elementRef);
		};

		useEffect(() => {
			chartRef.current = createChart(containerRef.current, {
				width,
				height: inititalHeight,
				rightPriceScale: {
					scaleMargins: {
						top: 0.3,
						bottom: 0.25,
					},
					borderVisible: false,
				},
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
				kineticScroll: {
					mouse: true,
				},
			});

			const legend = createLegendElement(containerRef.current, name);

			scope.candlestickSeries = chartRef.current.addCandlestickSeries({});
			scope.histogramSeries = chartRef.current.addHistogramSeries({
				priceFormat: {
					type: 'volume',
				},
				priceScaleId: '',
				scaleMargins: {
					top: 0.8,
					bottom: 0,
				},
			});

			chartRef.current.subscribeCrosshairMove(param => {
				const value = param.seriesPrices.get(scope.candlestickSeries) || '';

				legend.innerHTML = `${name} ${value}`;
			});
		}, []);

		useEffect(() => {
			if (!scope.candlestickSeries) return;
			scope.candlestickSeries.setData(priceData);
			fitContent && chartRef.current.timeScale().fitContent();
		}, [priceData, fitContent]);

		useEffect(() => {
			if (!scope.histogramSeries) return;
			scope.histogramSeries.setData(volumeData);
			fitContent && chartRef.current.timeScale().fitContent();
		}, [volumeData, fitContent]);

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

function createLegendElement(container: HTMLDivElement, text = '') {
	const legend = document.createElement('div');

	legend.classList.add('legend');
	legend.innerHTML = text;

	container.appendChild(legend);

	return legend;
}

function createPriceDataFromBars(bars: Array<Bar>): Array<BarData> {
	const data: Array<BarData> = bars.map(x => ({
		time: x.getTimestamp() as UTCTimestamp,
		open: x.getOpen(),
		high: x.getHight(),
		low: x.getLow(),
		close: x.getClose(),
	}));

	return data;
}

function createVolumeDataFromBars(bars: Array<Bar>): Array<HistogramData> {
	const data: Array<HistogramData> = bars.map(x => ({
		time: x.getTimestamp() as UTCTimestamp,
		value: x.getVolume(),
	}));

	return data;
}

type Scope = {
	candlestickSeries: SeriesApi<'Candlestick'>;
	histogramSeries: SeriesApi<'Histogram'>;
};

export { CandlestickChart, createPriceDataFromBars, createVolumeDataFromBars };
