import { Price, OrderDirection, OrderType } from '@core/market';

const exchangeApi = {
	fetchPrices: (options: FetchPriceOptions) => {
		return new Promise<Array<Price>>((resolve, reject) => {
			setTimeout(() => {
				const price = new Price('08-09-2021', 45000, 43000, 46000, 44000, 1000);

				resolve([price]);
			}, 100);
		});
	},
	makeOrder: (options: MakeOrderOptions) => {
		return new Promise<boolean>((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 100);
		});
	},
};

export type FetchPriceOptions = {
	symbol: string;
};

export type MakeOrderOptions = {
	symbol: string;
	direction: OrderDirection;
	type: OrderType;
	amount: number;
};

export { exchangeApi };
