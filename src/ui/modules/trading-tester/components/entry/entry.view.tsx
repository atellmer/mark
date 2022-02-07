import React from 'react';

import { Sample } from '@core/ai/sample';
import trainCarnumbersDataset from '@core/ai/datasets/carnumbers/train.csv';
import testCarnumbersDataset from '@core/ai/datasets/carnumbers/test.csv';
import trainIrisesDataset from '@core/ai/datasets/irises/train.csv';
import testIrisesDataset from '@core/ai/datasets/irises/test.csv';
import trainCancerDataset from '@core/ai/datasets/cancer/train.csv';
import testCancerDataset from '@core/ai/datasets/cancer/test.csv';
import trainTicTacToeDataset from '@core/ai/datasets/tic-tac-toe/train.csv';
import testTicTacToeDataset from '@core/ai/datasets/tic-tac-toe/test.csv';
//import pnnIrisesInlineEngine from '@core/ai/pnn/trained/irises-model.json';
//import pnnCarnumbersInlineEngine from '@core/ai/pnn/trained/carnumbers-model.json';
//import adaboostIrisesInlineEngine from '@core/ai/adaboost/trained/irises-model.json';
import { pnn } from '@core/ai/pnn';
import { adaboost } from '@core/ai/adaboost';
import { TradingTester } from '../tester';

(() => {
	const trainSamples = Sample.fromDataset(trainIrisesDataset);
	const testSamples = Sample.fromDataset(testIrisesDataset);

	// const pnnEngine = pnn({ samples: trainSamples });

	// pnnEngine.verasity(trainSamples, testSamples);

	console.log('start...');
	setTimeout(() => {
		const adaboostEngine = adaboost({
			samples: trainSamples,
			estimatorsTotal: 100,
			samplingSize: 10,
			enableLogs: true,
		});
		adaboostEngine.verasity(trainSamples, testSamples);
	}, 3000);
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
