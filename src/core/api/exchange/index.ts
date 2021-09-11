const exchangeApi = {
	fetchLastTick: (pair: string) => {
		return new Promise<number>((resolve, reject) => {
			setTimeout(() => {
				resolve(50000);
			}, 100);
		});
	},
};

export { exchangeApi };
