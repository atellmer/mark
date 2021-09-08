import { Sample } from '@core/ai/sample';
import { Market } from '@core/market';
import { Bot } from '@core/bot';
import { Trader } from '@core/trader';
import { StrategyAnsible, RandomStrategy } from '@core/strategy';
import { MoneyManagement, RiskTactics } from '@core/money';

function init() {
	// const symbol = 'btc_usdt';
	// const market = new Market(symbol);
	// const strategies = [new RandomStrategy()];
	// const ansible = new StrategyAnsible(strategies);
	// const trader = new Trader();
	// const moneyManagement = new MoneyManagement(RiskTactics.CONSERVATIVE);
	// const bot = new Bot(symbol, ansible, trader, moneyManagement);

	// market.subscribe(bot);
	// market.start();

	const trainSamples: Array<Sample> = Sample.normalize([
		new Sample([80, 180, 6, 1], 1),
		new Sample([50, 160, 500, 2], -1),
		new Sample([90, 190, 20, 1], 1),
		new Sample([80, 180, 100, 2], -1),
		new Sample([55, 170, 5, 2], -1),
	]);
	const testSamples: Array<Sample> = Sample.normalize([
		new Sample([70, 170, 4, 1], 1),
		new Sample([95, 182, 24, 1], 1),
		new Sample([130, 170, 250, 2], -1),
		new Sample([65, 185, 600, 2], -1),
		new Sample([60, 185, 0, 2], -1),
	]);

	console.log('trainSamples', trainSamples);
	console.log('testSamples', testSamples);
}

init();
