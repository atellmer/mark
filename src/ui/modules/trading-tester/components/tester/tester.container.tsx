import React, { useMemo, useState, useEffect } from 'react';

import { filterBars } from '@utils/trading';
import { createObjectMap } from '@utils/helpers';
import { Bar } from '@core/trading/primitives';
import { RiskBehaviour } from '@core/trading/risk';
import { TradingTester as TradingTesterLib, BalanceRecord } from '@core/trading/tester';
import { StrategyEnsemble, RandomStrategy } from '@core/trading/strategy';
import { TradingTester as XTradingTester, TradingTesterProps as XTradingTesterProps, useVariant } from './tester.view';
import pricesdataset from '@core/datasets/bars/btc_usdt_d.json';

export type TradingTesterProps = {} & Partial<Pick<XTradingTesterProps, 'variant'>>;

const TradingTester: React.FC<TradingTesterProps> = props => {
	const { variant } = props;
	const [balanceRecords, setBalanceRecords] = useState<Array<BalanceRecord>>([]);
	const [bars, setBars] = useState<Array<Bar>>([]);
	const pair = 'btc_usdt';
	const balance = 1000;
	const commission = 1;
	const riskBehaviour = RiskBehaviour.CONSERVATIVE;
	const ensemble = useMemo(() => new StrategyEnsemble([new RandomStrategy()]), []);
	const dateRange: DateRange = {
		dateStart: '01-01-2017 05:00:00',
		dateEnd: '01-09-2021 05:00:00',
	};
	const sourceBars = useMemo(() => filterBars(Bar.fromJSON(pricesdataset), dateRange), []);
	const { isPriceTracking } = useVariant(variant);

	useEffect(() => {
		(async () => {
			const tester = new TradingTesterLib({
				pair,
				balance,
				commission,
				bars: sourceBars,
				riskBehaviour,
				ensemble,
			});
			const { balanceRecords } = await tester.run();

			isPriceTracking ? trackPrice(balanceRecords) : trackYield(balanceRecords);
		})();
	}, []);

	useEffect(() => {
		if (isPriceTracking) return;
		setBars(sourceBars);
	}, [isPriceTracking]);

	const trackPrice = (balanceRecords: Array<BalanceRecord>) => {
		const [firstBar] = sourceBars;
		const barsBuffer: Array<Bar> = [];
		const balanceRecordsBuffer: Array<BalanceRecord> = [];
		const balanceRecordsMap = createObjectMap(balanceRecords, x => x.timestamp);

		const update = (bar: Bar) => {
			const balanceRecord = balanceRecordsMap[bar.getTimestamp()];

			barsBuffer.push(bar);
			setBars([...barsBuffer]);

			if (balanceRecord) {
				balanceRecordsBuffer.push(balanceRecord);
				setBalanceRecords([...balanceRecordsBuffer]);
			}

			const nextBar = sourceBars[barsBuffer.length + 1];

			if (nextBar) {
				setTimeout(() => {
					update(nextBar);
				}, UPDATE_INTERVAL);
			}
		};

		update(firstBar);
	};

	const trackYield = (balanceRecords: Array<BalanceRecord>) => {
		const [firstBalanceRecord] = balanceRecords;
		const balanceRecordsBuffer: Array<BalanceRecord> = [];
		const update = (balanceRecord: BalanceRecord) => {
			balanceRecordsBuffer.push(balanceRecord);
			setBalanceRecords([...balanceRecordsBuffer]);

			const nextBalanceRecord = balanceRecords[balanceRecordsBuffer.length + 1];

			if (nextBalanceRecord) {
				setTimeout(() => {
					update(nextBalanceRecord);
				}, UPDATE_INTERVAL);
			}
		};

		update(firstBalanceRecord);
	};

	return <XTradingTester {...props} variant={variant} pair={pair} balanceRecords={balanceRecords} bars={bars} />;
};

const UPDATE_INTERVAL = 100;

TradingTester.defaultProps = {
	variant: 'yield-tracking',
};

export { TradingTester };
