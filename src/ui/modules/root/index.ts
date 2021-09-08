import { Market } from '@core/market';
import { Bot } from '@core/bot';
import { Trader } from '@core/trader';
import { StrategyAnsible, BoostingStrategy } from '@core/strategy';

function init() {
	const symbol = 'btc_usdt';
	const market = new Market(symbol);
	const trader = new Trader(symbol);
	const strategies = [new BoostingStrategy()];
	const ansible = new StrategyAnsible(strategies);
	const bot = new Bot(ansible, trader);

	market.subscribe(bot);
	market.start();
}

init();
