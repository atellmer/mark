import React from 'react';

import { Sample } from '@core/ai/sample';
import { evolution } from '@core/ai/metacode';
import { TradingTester } from '../tester';

(() => {
	const alfa = evolution({
		samples: [
			new Sample([26, 35], 829),
			new Sample([8, 24], 141),
			new Sample([20, 1], 467),
			new Sample([33, 11], 1215),
			new Sample([37, 16], 1517),
		],
		poolSize: 10000,
		maxGenerations: 100000,
		searchSpace: [-100, 100],
		mutationProb: 0.5,
		crossProb: 0.9,
		maxDepth: 5,
		enableLogging: true,
	});

	console.log('alfa program', alfa);
	console.log('alfa print', alfa.print());
	console.log('alfa predict', alfa.predict([1, 2]));
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
