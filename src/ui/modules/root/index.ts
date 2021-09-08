import { Market } from '@core/market';
import { Bot } from '@core/bot';
import { Trader } from '@core/trader';
import { StrategyAnsible, RandomStrategy } from '@core/strategy';
import { MoneyManagement, RiskTactics } from '@core/money';

function init() {
	const symbol = 'btc_usdt';
	const market = new Market(symbol);
	const strategies = [new RandomStrategy()];
	const ansible = new StrategyAnsible(strategies);
	const trader = new Trader();
	const moneyManagement = new MoneyManagement(RiskTactics.CONSERVATIVE);
	const bot = new Bot(symbol, ansible, trader, moneyManagement);

	market.subscribe(bot);
	market.start();
}

init();
