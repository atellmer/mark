import { OrderDirection } from './order';

class Deal {
	private ID: number;
	private pair: string;
	private direction: OrderDirection;
	private price: number;
	private quantity: number;
	private timestamp: number;

	constructor(options: DealOptions) {
		const { pair, direction, price, quantity, timestamp } = options;

		this.ID = Deal.getNextID();
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

type DealOptions = {
	pair: string;
	direction: OrderDirection;
	price: number;
	quantity: number;
	timestamp: number;
};

export { Deal };
