class Order {
	private ticker: Ticker;
	private type: OrderType;
	private direction: OrderDirection;
	private amount: number;

	constructor(ticker: Ticker, type: OrderType, direction: OrderDirection, amount: number) {
		this.ticker = ticker;
		this.type = type;
		this.direction = direction;
		this.amount = amount;
	}

	public getTicker(): Ticker {
		return this.ticker;
	}

	public getType(): OrderType {
		return this.type;
	}

	public getDirection(): OrderDirection {
		return this.direction;
	}

	public getAmount(): number {
		return this.amount;
	}
}

export enum Ticker {
	BTC = 'BTC',
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
