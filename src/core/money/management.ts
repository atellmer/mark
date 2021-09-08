import { exchangeApi } from '@core/api';
import { Price } from '../market';

class MoneyManagement {
	getOrderParameters(price: Price): Promise<GetOrderParameters> {
		return new Promise<GetOrderParameters>(async resolve => {
			const balance = await exchangeApi.fetchAccountBalance({});
			const amount = balance / 10;
			const takeProfit = price.close + 1000;
			const stopLoss = price.close - 300;

			resolve({
				amount,
				takeProfit,
				stopLoss,
			});
		});
	}
}

export type GetOrderParameters = {
	amount: number;
	takeProfit: number;
	stopLoss: number;
};

export { MoneyManagement };
