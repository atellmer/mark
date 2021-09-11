import { convertUnixTimestampToDate } from '@utils/date';
import { saveJsonToFile } from '@utils/file';

class Price {
	timestamp: number;
	date: string;
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;

	constructor(timestamp: number, open: number, low: number, hight: number, close: number, volume: number) {
		this.timestamp = timestamp;
		this.date = convertUnixTimestampToDate(timestamp);
		this.open = open;
		this.low = low;
		this.hight = hight;
		this.close = close;
		this.volume = volume;
	}

	public static toJSON(filename: string, prices: Array<Price>) {
		const json = JSON.stringify(prices);

		saveJsonToFile(json, filename);
	}

	public static fromJSON(inline: string | Array<InlinePrice>): Array<Price> {
		const data = (typeof inline === 'string' ? JSON.parse(inline) : inline) as Array<InlinePrice>;
		const prices = data.map(x => new Price(x.timestamp, x.open, x.low, x.hight, x.close, x.volume));

		return prices;
	}
}

export type InlinePrice = {
	timestamp: number;
	date: string;
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;
};

export { Price };
