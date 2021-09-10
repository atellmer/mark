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
	const trainSamples = Sample.fromDataset(irisesTrainDataset);
	const testSamples = Sample.fromDataset(irisesTestDataset);

	const model = adaboost({ samples: trainSamples, estimatorsNumber: 10 });

	const result = model.verasity(trainSamples, testSamples);

	console.log('train error: ', result.trainError);
}



init();
