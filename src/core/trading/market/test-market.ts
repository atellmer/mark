import { getTimestamp } from '@utils/date';
import { Bar } from '@core/trading/primitives';
import { Market } from './market';

type TestMarketConstructor = {
	pair: string;
	bars: Array<Bar>;
	dateRange: DateRange;
};

class TestMarket extends Market {
	private bars: Array<Bar> = [];
	private dateRange: DateRange;

	constructor(options: TestMarketConstructor) {
		super(options.pair);
		const { bars, dateRange } = options;

		this.bars = bars;
		this.dateRange = dateRange;
	}

	public start(): Promise<number> {
		return new Promise(async resolve => {
			const pair = this.getPair();
			const bars = TestMarket.filterBars(this.dateRange, this.bars);

			for (let i = 0; i < bars.length; i++) {
				const bar = bars[i];
				const tick = bar.getClose();
				const timestamp = bar.getTimestamp();
				const promises = this.mapSubscribers(x => x.notifyAboutLastTick({ pair, tick, timestamp }));

				await Promise.all(promises);

				if (i === bars.length - 1) {
					resolve(bar.getClose());
				}
			}
		});
	}

	public stop() {}

	private static filterBars(dateRange: DateRange, sourceBars: Array<Bar>) {
		const start = getTimestamp(dateRange.dateStart);
		const end = getTimestamp(dateRange.dateEnd);
		const bars = sourceBars.filter(x => x.getTimestamp() >= start && x.getTimestamp() <= end);

		return bars;
	}
}

export { TestMarket };
