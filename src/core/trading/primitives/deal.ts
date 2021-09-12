import { OrderDirection } from './order';

type DealConstructor = {
	ticker: string;
	pair: string;
	direction: OrderDirection;
	price: number;
	quantity: number;
	timestamp: number;
};

class Deal {
	private ID: number;
	private ticker: string;
	private pair: string;
	private direction: OrderDirection;
	private price: number;
	private quantity: number;
	private timestamp: number;

	constructor(options: DealConstructor) {
		const { ticker, pair, direction, price, quantity, timestamp } = options;

		this.ID = Deal.getNextID();
		this.ticker = ticker;
		this.pair = pair;
		this.direction = direction;
		this.price = price;
		this.quantity = quantity;
		this.timestamp = timestamp;
	}

	static nextID = 0;

	private static getNextID() {
		return ++Deal.nextID;
	}

	public getID(): number {
		return this.ID;
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

	public getPrice(): number {
		return this.price;
	}

	public getQuantity(): number {
		return this.quantity;
	}

	public getTimestamp(): number {
		return this.timestamp;
	}
}

export { Deal };
