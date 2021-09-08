import { Market } from '@core/market';
import { Bot } from '@core/bot';
import { Trader } from '@core/trader';
import { StrategyAnsible, BoostingStrategy } from '@core/strategy';
import { MoneyManagement } from '@core/money';

function init() {
	const symbol = 'btc_usdt';
	const market = new Market(symbol);
	const strategies = [new BoostingStrategy()];
	const ansible = new StrategyAnsible(strategies);
	const trader = new Trader();
	const mm = new MoneyManagement();
	const bot = new Bot(symbol, ansible, trader, mm);

	market.subscribe(bot);
	market.start();
}

init();
