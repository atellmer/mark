import { exchangeApi } from '@core/api';
import { getUnixTime } from '@utils/date';
import { Market } from './market';

class ExchangeMarket extends Market {
	private interval = 1000;
	private intervalID = null;

	public start() {
		this.intervalID = setInterval(async () => {
			const pair = this.getPair();
			const tick = await exchangeApi.fetchLastTick(pair);
			const timestamp = getUnixTime();

			this.mapSubscribers(x => x.notifyAboutLastTick({ pair, tick, timestamp }));
		}, this.interval);
	}

	public stop() {
		clearInterval(this.intervalID);
	}
}

export { ExchangeMarket };
