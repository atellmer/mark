class Price {
	date: string;
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;

	constructor(date: string, open: number, low: number, hight: number, close: number, volume: number) {
		this.date = date;
		this.open = open;
		this.low = low;
		this.hight = hight;
		this.close = close;
		this.volume = volume;
	}
}

export { Price };
