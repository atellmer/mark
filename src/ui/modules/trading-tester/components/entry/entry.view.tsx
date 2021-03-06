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
import xorDataset from '@core/ai/datasets/xor/train.csv';
import { decisiontree } from '@core/ai/trees';
import { TradingTester } from '../tester';

(() => {
	const trainSamples = Sample.fromDataset(trainCarnumbersDataset);
	const testSamples = Sample.fromDataset(testCarnumbersDataset);

	const engine = decisiontree({ variant: 'fit', samples: trainSamples });

	console.log('engine', engine);

	engine.verasity({
		train: trainSamples,
		test: testSamples,
	});
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
