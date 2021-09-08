import { exchangeApi } from '@core/api';
import { Price } from './price';

export interface MarketSubscriber {
	notify: (price: Price) => void;
}

class Market {
	private symbol: string;
	private subscribers: Array<MarketSubscriber> = [];
	private intervalID = null;
	private pollyInterval = 1000;

	constructor(symbol: string) {
		this.symbol = symbol;
	}

	public subscribe(subscriber: MarketSubscriber) {
		this.subscribers.push(subscriber);
	}

	public start() {
		this.intervalID = setInterval(async () => {
			const prices = await exchangeApi.fetchPrices({ symbol: this.symbol });
			const lastPrice = prices[prices.length - 1];

			for (const subscriber of this.subscribers) {
				subscriber.notify(lastPrice);
			}
		}, this.pollyInterval);
	}

	public stop() {
		clearInterval(this.intervalID);
	}
}

export { Market };
