abstract class Market {
	private pair: string;
	private subscribers: Array<MarketSubscriber> = [];

	constructor(pair: string) {
		this.pair = pair;
	}

	protected getPair(): string {
		return this.pair;
	}

	protected mapSubscribers(fn: (subscriber: MarketSubscriber) => Promise<boolean>): Array<Promise<boolean>> {
		return this.subscribers.map(subscriber => fn(subscriber));
	}

	public subscribe(subscriber: MarketSubscriber) {
		this.subscribers.push(subscriber);
	}

	public abstract start(): void;

	public abstract stop(): void;
}

export interface MarketSubscriber {
	notifyAboutLastTick: (options: NotifyAboutLastTickOptions) => Promise<boolean>;
}

export type NotifyAboutLastTickOptions = {
	pair: string;
	tick: number;
	timestamp: number;
};

export { Market };
