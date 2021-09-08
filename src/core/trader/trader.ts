import { exchangeApi } from '@core/api';
import { OrderType, OrderDirection } from '../market';

class Trader {
	private symbol: string;

	constructor(symbol: string) {
		this.symbol = symbol;
	}

	public buy(options: MakeOrderOptions) {
		const { amount, type } = options;

		return exchangeApi.makeOrder({ amount, type, symbol: this.symbol, direction: OrderDirection.BUY });
	}

	public sell(options: MakeOrderOptions) {
		const { amount, type } = options;

		return exchangeApi.makeOrder({ amount, type, symbol: this.symbol, direction: OrderDirection.SELL });
	}
}

export type MakeOrderOptions = {
	amount: number;
	type: OrderType;
};

export { Trader };
