import { Bar } from '@core/trading/primitives';
import { Market } from './market';

type TestMarketConstructor = {
	pair: string;
	bars: Array<Bar>;
};

class TestMarket extends Market {
	private bars: Array<Bar> = [];

	constructor(options: TestMarketConstructor) {
		super(options.pair);
		const { bars } = options;

		this.bars = bars;
	}

	public start(): Promise<number> {
		return new Promise(async resolve => {
			const pair = this.getPair();
			const bars = this.bars;

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
}

export { TestMarket };
