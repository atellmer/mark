import { Order, Deal } from '@core/trading/primitives';
import { Trader } from './trader';

class TestTrader extends Trader {
	public execute(order: Order) {
		return new Promise<Deal>(resolve => {
			const ticker = order.getTicker();
			const pair = order.getPair();
			const direction = order.getDirection();
			const price = order.getPrice();
			const quantity = order.getQuantity();
			const timestamp = order.getTimestamp();
			const deal = new Deal({ ticker, pair, direction, price, quantity, timestamp });

			resolve(deal);
		});
	}
}

export { TestTrader };
