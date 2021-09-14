import React, { useMemo } from 'react';

import { Bar } from '@core/trading/primitives';
import { CandlestickChart, createPriceDataFromBars, createVolumeDataFromBars } from '@ui/kit/candlestick-chart';
import { AreaChart, createAreaDataFromBalanceRecords } from '@ui/kit/area-chart';
import { Card } from '@ui/kit/card';
import { BalanceRecord } from '@core/trading/tester';
import { Root } from './styled';

export type TradingTesterProps = {
	balanceRecords: Array<BalanceRecord>;
	bars: Array<Bar>;
};

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { balanceRecords, bars } = props;
	const priceData = useMemo(() => createPriceDataFromBars(bars), [bars]);
	const volumeData = useMemo(() => createVolumeDataFromBars(bars), [bars]);
	const balanceRecordsData = useMemo(() => createAreaDataFromBalanceRecords(balanceRecords), [balanceRecords]);

	return (
		<Root>
			<Card marginBottom={16} fullWidth>
				<CandlestickChart priceData={priceData} volumeData={volumeData} height={400} />
			</Card>
			<Card fullWidth>
				<AreaChart data={balanceRecordsData} height={300} fitContent />
			</Card>
		</Root>
	);
};

export { TradingTester };
