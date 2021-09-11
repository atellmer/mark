class Order {
	private pair: string;
	private direction: OrderDirection;
	private type: OrderType;
	private tick: number;
	private stopLoss: number;
	private takeProfit: number;
	private amount: number;
	private timestamp: number;

	constructor(options: OrderOptions) {
		const { pair, direction, type, tick, stopLoss, takeProfit, amount, timestamp } = options;

		this.pair = pair;
		this.direction = direction;
		this.type = type;
		this.tick = tick;
		this.stopLoss = stopLoss;
		this.takeProfit = takeProfit;
		this.amount = amount;
		this.timestamp = timestamp;
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

	public getTick(): number {
		return this.tick;
	}

	public getStopLoss(): number {
		return this.stopLoss;
	}

	public getTakeProfit(): number {
		return this.takeProfit;
	}

	public getAmount(): number {
		return this.amount;
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

type OrderOptions = {
	pair: string;
	timestamp: number;
	tick: number;
	stopLoss: number;
	takeProfit: number;
	type: OrderType;
	direction: OrderDirection;
	amount: number;
};

export { Order };
