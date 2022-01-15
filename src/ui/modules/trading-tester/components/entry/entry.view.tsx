import React from 'react';

import { evolution } from '@core/ai/genetics';
import { TradingTester } from '../tester';

(async () => {
	const [x, y, z, n] = await evolution({
		variant: 'minimization',
		chromosomeSize: 4,
		maxIterations: Infinity,
		poolSize: 10000,
		searchSpace: [0, 100],
		fitness: ([x, y, z, n]) =>
			x > 1 && y > 1 && z > 1 && n > 1 && n < 10
				? Math.abs(Math.pow(z, n) - (Math.pow(x, n) + Math.pow(y, n)))
				: Number.MAX_SAFE_INTEGER,
	});

	console.log('minimization');
	console.log('source', `x ^ n + y ^ n = z ^ n`);
	console.log('formula', `${x} ^ ${n} + ${y} ^ ${n} = ${z} ^ ${n} (${Math.pow(z, n)})`);
	console.log(x, y, z, n);

	const [x1, y1] = await evolution({
		variant: 'maximization',
		chromosomeSize: 2,
		maxIterations: 10,
		poolSize: 10000,
		searchSpace: [0, 1000],
		fitness: ([x, y]) => x + y,
	});

	console.log('maximization', x1, y1);
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
