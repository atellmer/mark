import { Sample } from '@core/ai/sample';
import { StrongClassifier } from '@core/ai/boosting';
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
		new Sample([130, 115, 25, 2], -1),
		new Sample([65, 90, 60, 2], -1),
		new Sample([60, 101, 40, 2], -1),
		new Sample([70, 220, 30, 1], 1),
		new Sample([70, 80, 40, 1], -1),
	]);
	const testSamples: Array<Sample> = Sample.normalize([
		new Sample([80, 120, 6, 1], -1),
		new Sample([50, 110, 50, 2], -1),
		new Sample([50, 100, 50, 2], -1),
		new Sample([90, 190, 20, 1], 1),
		new Sample([80, 180, 18, 2], 1),
		new Sample([55, 170, 15, 2], 1),
	]);

	const classifiers = StrongClassifier.train(trainSamples, 20);

	console.log('trainSamples', trainSamples);
	console.log('testSamples', testSamples);
	console.log('classifiers', classifiers);

	for (const sample of testSamples) {
		const predict = StrongClassifier.getPredict(sample.getPattern(), classifiers);

		console.log('predict', predict);
	}
}

init();
