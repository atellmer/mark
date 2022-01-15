import React from 'react';

import { evolution } from '@core/ai/genetics';
import { TradingTester } from '../tester';

(() => {
	const [x, y, z, n] = evolution({
		chromosomeSize: 4,
		poolSize: 10000,
		searchSpace: [0, 10],
		fitness: ([x, y, z, n]) =>
			x > 1 && y > 1 && z > 1 && n > 1 && n < 10
				? Math.abs(Math.pow(z, n) - (Math.pow(x, n) + Math.pow(y, n)))
				: Number.MAX_SAFE_INTEGER,
	});

	console.log('source', `x ^ n + y ^ n = z ^ n`);
	console.log('formula', `${x} ^ ${n} + ${y} ^ ${n} = ${z} ^ ${n} (${Math.pow(z, n)})`);
	console.log(x, y, z, n);
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
