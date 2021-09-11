import { convertUnixTimeToTime } from '@utils/date';
import { saveJsonToFile } from '@utils/file';

class Bar {
	private timestamp: number;
	private time: string;
	private open: number;
	private low: number;
	private hight: number;
	private close: number;
	private volume: number;

	constructor(options: BarOptions) {
		const { timestamp, open, low, hight, close, volume } = options;

		this.timestamp = timestamp;
		this.time = convertUnixTimeToTime(timestamp);
		this.open = open;
		this.low = low;
		this.hight = hight;
		this.close = close;
		this.volume = volume;
	}

	public getTime(): string {
		return this.time;
	}

	public getTimestamp(): number {
		return this.timestamp;
	}

	public getOpen(): number {
		return this.open;
	}

	public getLow(): number {
		return this.low;
	}

	public getHight(): number {
		return this.hight;
	}

	public getClose(): number {
		return this.close;
	}

	public getVolume(): number {
		return this.volume;
	}

	public static toJSON(filename: string, bars: Array<Bar>) {
		const json = JSON.stringify(bars);

		saveJsonToFile(json, filename);
	}

	public static fromJSON(inline: string | Array<InlineBar>): Array<Bar> {
		const data = (typeof inline === 'string' ? JSON.parse(inline) : inline) as Array<InlineBar>;
		const bars = data
			.map(
				x =>
					new Bar({
						timestamp: x.timestamp,
						open: x.open,
						low: x.low,
						hight: x.hight,
						close: x.close,
						volume: x.volume,
					}),
			)
			.filter(x => x.getClose() > 0);

		return bars;
	}
}

type BarOptions = {
	timestamp: number;
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;
};

export type InlineBar = BarOptions & {
	time: string;
};

export { Bar };
