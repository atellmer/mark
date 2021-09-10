class Price {
	time: number;
	open: number;
	low: number;
	hight: number;
	close: number;
	volume: number;

	constructor(time: number, open: number, low: number, hight: number, close: number, volume: number) {
		this.time = time;
		this.open = open;
		this.low = low;
		this.hight = hight;
		this.close = close;
		this.volume = volume;
	}
}

export { Price };
