import { convertUnixTimeToTime } from '@utils/date';
import { OrderDirection } from './order';

class Deal {
	private pair: string;
	private direction: OrderDirection;
	private tick: number;
	private amount: number;
	private timestamp: number;
	private time: string;

	constructor(options: DealOptions) {
		const { pair, direction, tick, amount, timestamp } = options;

		this.pair = pair;
		this.direction = direction;
		this.tick = tick;
		this.amount = amount;
		this.timestamp = timestamp;
		this.time = convertUnixTimeToTime(timestamp);
	}

	public getPair(): string {
		return this.pair;
	}

	public getDirection(): OrderDirection {
		return this.direction;
	}

	public getTick(): number {
		return this.tick;
	}

	public getAmount(): number {
		return this.amount;
	}

	public getTimestamp(): number {
		return this.timestamp;
	}

	public getTimes(): string {
		return this.time;
	}
}

type DealOptions = {
	pair: string;
	direction: OrderDirection;
	tick: number;
	amount: number;
	timestamp: number;
};

export { Deal };
