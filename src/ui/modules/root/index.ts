import { Sample } from '@core/ai/sample';
import { adaboost, StrongClassifier } from '@core/ai/adaboost';
import { Market } from '@core/market';
import { Bot } from '@core/bot';
import { Trader } from '@core/trader';
import { StrategyAnsible, RandomStrategy } from '@core/strategy';
import { MoneyManagement, RiskTactics } from '@core/money';
import trained from '@core/ai/adaboost/trained/x.json';
import irisesTrainDataset from '@core/ai/datasets/irises/train.csv';
import irisesTestDataset from '@core/ai/datasets/irises/test.csv';

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

	const trainSamples: Array<Sample> = ([
		new Sample([1, 150, 85, 4], 1),
		new Sample([1, 140, 80, 4], 1),
		new Sample([1, 130, 70, 4], 1),
		new Sample([1, 90, 90, 4], 1),
		new Sample([1, 90, 100, 4], -1),
		new Sample([1, 80, 110, 4], -1),
		new Sample([1, 70, 120, 4], -1),
	]);
	const testSamples: Array<Sample> = ([
		new Sample([1, 131, 76, 4], 1),
		new Sample([3, 129, 86, 6], 1),
		new Sample([5, 98, 83, 8], 1),
		new Sample([2, 92, 111, 5], -1),
		new Sample([6, 82, 121, 9], -1),
		new Sample([4, 72, 131, 7], -1),
	]);

	const model = adaboost({ samples: trainSamples, estimatorsNumber: 1 });
	const result = model.verasity(trainSamples, testSamples);
	//const predict = model.predict(testSamples[0].getPattern());

	console.log('result', result);

	const classifiers = StrongClassifier.train(trainSamples, 1);

	for (const sample of testSamples) {
		const prediction = StrongClassifier.predict(sample.getPattern(), classifiers);

		console.log('sample', sample);
		console.log('prediction', prediction);
	}

	// const trainSamples = Sample.fromDataset(irisesTrainDataset);
	// const testSamples = Sample.fromDataset(irisesTestDataset);

	// const model = adaboost({ samples: trainSamples, estimatorsNumber: 10 });
	// const result = model.verasity(trainSamples, testSamples);

	// console.log('result', result)

	// for (const sample of trainSamples) {
	// 	const prediction = model.predict(sample.getPattern());

	// 	if (prediction !== sample.getAnswer()) {
	// 		console.log('sample', sample);
	// 		console.log('prediction', prediction);
	// 		break;
	// 	}
	// }
}

init();
