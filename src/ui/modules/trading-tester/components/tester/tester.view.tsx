import React, { useMemo } from 'react';

import { Bar } from '@core/trading/primitives';
import { CandlestickChart, createPriceDataFromBars, createVolumeDataFromBars } from '@ui/kit/candlestick-chart';
import { AreaChart, createAreaDataFromBalanceRecords } from '@ui/kit/area-chart';
import { Card } from '@ui/kit/card';
import { BalanceRecord } from '@core/trading/tester';
import { Root } from './styled';

export type TradingTesterProps = {
	variant: 'price-tracking' | 'yield-tracking';
	balanceRecords: Array<BalanceRecord>;
	bars: Array<Bar>;
};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { variant, balanceRecords, bars } = props;
	const { isPriceTracking } = useVariant(variant);
	const priceData = useMemo(() => createPriceDataFromBars(bars), [bars]);
	const volumeData = useMemo(() => createVolumeDataFromBars(bars), [bars]);
	const balanceRecordsData = useMemo(() => createAreaDataFromBalanceRecords(balanceRecords), [balanceRecords]);

	return (
		<Root>
			{isPriceTracking && (
				<Card marginBottom={16} fullWidth>
					<CandlestickChart priceData={priceData} volumeData={volumeData} height={300} />
				</Card>
			)}
			<Card fullWidth>
				<AreaChart data={balanceRecordsData} height={300} fitContent />
			</Card>
		</Root>
	);
};

function useVariant(variant: TradingTesterProps['variant']) {
	const isPriceTracking = variant === 'price-tracking';
	const isYieldTracking = variant === 'yield-tracking';

	return {
		isPriceTracking,
		isYieldTracking,
	};
}

export { TradingTester, useVariant };
