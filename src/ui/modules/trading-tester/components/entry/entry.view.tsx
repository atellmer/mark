import React from 'react';

import { Sample } from '@core/ai/sample';
import trainCarnumbersDataset from '@core/ai/datasets/carnumbers/train.csv';
import testCarnumbersDataset from '@core/ai/datasets/carnumbers/test.csv';
import trainIrisesDataset from '@core/ai/datasets/irises/train.csv';
import testIrisesDataset from '@core/ai/datasets/irises/test.csv';
//import pnnIrisesInlineEngine from '@core/ai/pnn/trained/irises-model.json';
//import pnnCarnumbersInlineEngine from '@core/ai/pnn/trained/carnumbers-model.json';
//import adaboostIrisesInlineEngine from '@core/ai/adaboost/trained/irises-model.json';
import { pnn } from '@core/ai/pnn';
import { adaboost } from '@core/ai/adaboost';
import { TradingTester } from '../tester';

(() => {
	const trainSamples = Sample.fromDataset(trainIrisesDataset);
	const testSamples = Sample.fromDataset(testIrisesDataset);

	const pnnEngine = pnn({ samples: trainSamples });

	pnnEngine.verasity(trainSamples, testSamples);

	// const adaboostEngine = adaboost({
	// 	samples: trainSamples,
	// 	estimatorsTotal: 100,
	// 	enableLogs: true,
	// });

	// adaboostEngine.verasity(trainSamples, testSamples);
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
