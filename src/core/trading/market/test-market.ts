import { Bar } from '@core/trading/primitives';
import { Market } from './market';

class TestMarket extends Market {
	private bars: Array<Bar> = [];

	constructor(pair: string, bars: Array<Bar>) {
		super(pair);
		this.bars = bars;
	}

	public start() {
		const pair = this.getPair();

		for (const bar of this.bars) {
			const tick = bar.getClose();
			const timestamp = bar.getTimestamp();

			this.mapSubscribers(x => x.notifyAboutLastTick({ pair, tick, timestamp }));
		}
	}

	public stop() {}
}

export { TestMarket };
