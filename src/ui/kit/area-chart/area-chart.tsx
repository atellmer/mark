import React, { useRef, useEffect, useLayoutEffect, useMemo, memo, forwardRef } from 'react';
import {
	createChart,
	ColorType,
	LineData,
	UTCTimestamp,
	IChartApi as ChartApi,
	ISeriesApi as SeriesApi,
} from 'lightweight-charts';
import useMeasure from 'react-use-measure';

import { fix } from '@utils/math';
import type { BalanceRecord } from '@core/trading/tester';
import { useTheme } from '@ui/theme';

export type AreaChartProps = {
	height: number;
	data: Array<LineData>;
	fitContent?: boolean;
};

const AreaChart = memo(
	forwardRef<{}, AreaChartProps>((props, ref) => {
		const { height: inititalHeight, data, fitContent } = props;
		const rootRef = useRef<HTMLDivElement>();
		const chartRef = useRef<ChartApi>();
		const [measureRef, { width, height }] = useMeasure();
		const { theme } = useTheme();
		const scope: Scope = useMemo(() => ({ areaSeries: null }), []);

		const setRootRef = (elementRef: HTMLDivElement) => {
			rootRef.current = elementRef;
			measureRef(elementRef);
		};

		useEffect(() => {
			chartRef.current = createChart(rootRef.current, {
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
				kineticScroll: {
					mouse: true,
				},
			});

			scope.areaSeries = chartRef.current.addAreaSeries({});
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

		return <div ref={setRootRef} />;
	}),
);

type Scope = {
	areaSeries: SeriesApi<'Area'>;
};

function createAreaDataFromBalanceRecords(balanceRecords: Array<BalanceRecord>) {
	const data = balanceRecords.map(x => ({ time: x.timestamp as UTCTimestamp, value: fix(x.value, 2) }));

	return data;
}

export { AreaChart, createAreaDataFromBalanceRecords };
