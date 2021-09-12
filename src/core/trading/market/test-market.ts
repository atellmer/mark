import { Bar } from '@core/trading/primitives';
import { Market } from './market';

class TestMarket extends Market {
	private bars: Array<Bar> = [];

	constructor(pair: string, bars: Array<Bar>) {
		super(pair);
		this.bars = bars;
	}

	public start(): Promise<number> {
		return new Promise(resolve => {
			const pair = this.getPair();

			for (let i = 0; i < this.bars.length; i++) {
				const bar = this.bars[i];
				const tick = bar.getClose();
				const timestamp = bar.getTimestamp();

				setTimeout(() => {
					this.mapSubscribers(x => x.notifyAboutLastTick({ pair, tick, timestamp }));

					if (i === this.bars.length - 1) {
						resolve(bar.getClose());
					}
				});
			}
		});
	}

	public stop() {}
}

export { TestMarket };
