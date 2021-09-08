import { exchangeApi, MakeOrderOptions as MakeOrderOptionsAPI } from '@core/api';
import { OrderDirection } from '../market';

class Trader {
	public buy(options: MakeOrderOptions) {
		return exchangeApi.makeOrder({ ...options, direction: OrderDirection.BUY });
	}

	public sell(options: MakeOrderOptions) {
		return exchangeApi.makeOrder({ ...options, direction: OrderDirection.SELL });
	}
}

export type MakeOrderOptions = Omit<MakeOrderOptionsAPI, 'direction'>;

export { Trader };
