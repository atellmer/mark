import { Order, Deal } from '@core/trading/primitives';
import { Trader } from './trader';

class TestTrader extends Trader {
	public execute(order: Order) {
		return new Promise<Deal>(resolve => {
			const pair = order.getPair();
			const direction = order.getDirection();
			const tick = order.getTick();
			const amount = order.getAmount();
			const timestamp = order.getTimestamp();
			const deal = new Deal({ pair, direction, tick, amount, timestamp });

			resolve(deal);
		});
	}
}

export { TestTrader };
