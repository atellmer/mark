import { Order, Deal } from '@core/trading/primitives';

abstract class Trader {
	abstract execute(order: Order): Promise<Deal>;
}

export { Trader };
