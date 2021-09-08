import { random } from '@utils/math';
import { Price, OrderDirection, OrderType } from '@core/market';

const exchangeApi = {
	fetchPrices: (options: FetchPriceOptions) => {
		return new Promise<Array<Price>>((resolve, reject) => {
			setTimeout(() => {
				const open = 40000 + random(-2000, 2000);
				const price = new Price('08-09-2021 00:00', open, open - 1000, open + 2000, open + 500, 1000);

				resolve([price]);
			}, 100);
		});
	},
	makeOrder: (options: MakeOrderOptions) => {
		return new Promise<boolean>((resolve, reject) => {
			setTimeout(() => {
				console.log('options', options)
				resolve(true);
			}, 100);
		});
	},
	fetchAccountBalance: (options: FetchAccountBalanceOptions) => {
		return new Promise<number>((resolve, reject) => {
			setTimeout(() => {
				resolve(10000);
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
	currentPrice: number;
	stopLoss: number;
	takeProfit: number;
};

export type FetchAccountBalanceOptions = {};

export { exchangeApi };
