import { Sample } from '@core/ai/sample';
import { AdaBoost } from '@core/ai/adaboost';
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
		new Sample([70, 200, 18, 1], 1),
		new Sample([70, 170, 16, 1], 1),
		new Sample([95, 182, 24, 1], 1),
		new Sample([130, 115, 25, 2], 2),
		new Sample([65, 90, 60, 2], 2),
		new Sample([60, 101, 40, 2], 2),
	]);
	const testSamples: Array<Sample> = Sample.normalize([
		new Sample([80, 120, 6, 1], 2),
		new Sample([50, 110, 50, 2], 2),
		new Sample([50, 100, 50, 2], 2),
		new Sample([90, 190, 20, 1], 1),
		new Sample([80, 180, 18, 2], 1),
		new Sample([55, 170, 15, 2], 1),
	]);

	const adaBoost = new AdaBoost(trainSamples, 10);
	const model = adaBoost.train();
	const predict = model.predict(testSamples[0].getPattern());

	console.log('predict', predict)

	// for (const sample of testSamples) {
	// 	const predict = StrongClassifier.predict(sample.getPattern(), classifiers);
	// }

	// console.log('end')
}

init();
