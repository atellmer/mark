import { Order, Deal } from '@core/trading/primitives';
import { Trader } from './trader';

class ExchangeTrader extends Trader {
	public execute(order: Order) {
		return new Promise<Deal>(resolve => resolve(null));
	}
}

export { ExchangeTrader };
