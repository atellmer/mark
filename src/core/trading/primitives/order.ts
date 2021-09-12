type OrderConstructor = {
	ticker: string;
	pair: string;
	direction: OrderDirection;
	type: OrderType;
	price: number;
	quantity: number;
	stoploss: number;
	takeprofit: number;
	timestamp: number;
};

class Order {
	private ticker: string;
	private pair: string;
	private direction: OrderDirection;
	private type: OrderType;
	private price: number;
	private quantity: number;
	private stoploss: number;
	private takeprofit: number;
	private timestamp: number;

	constructor(options: OrderConstructor) {
		const { ticker, pair, direction, type, price, quantity, stoploss, takeprofit, timestamp } = options;

		this.ticker = ticker;
		this.pair = pair;
		this.direction = direction;
		this.type = type;
		this.price = price;
		this.quantity = quantity;
		this.stoploss = stoploss;
		this.takeprofit = takeprofit;
		this.timestamp = timestamp;
	}

	public getTicker(): string {
		return this.ticker;
	}

	public getPair(): string {
		return this.pair;
	}

	public getDirection(): OrderDirection {
		return this.direction;
	}

	public getType(): OrderType {
		return this.type;
	}

	public getPrice(): number {
		return this.price;
	}

	public getQuantity(): number {
		return this.quantity;
	}

	public getStoploss(): number {
		return this.stoploss;
	}

	public getTakeprofit(): number {
		return this.takeprofit;
	}

	public getTimestamp(): number {
		return this.timestamp;
	}
}

export enum OrderType {
	MARKET = 'market',
	LIMIT = 'limit',
}

export enum OrderDirection {
	BUY = 'buy',
	SELL = 'sell',
}

export { Order };
