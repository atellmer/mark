import React from 'react';

import { evolution } from '@core/ai/genetics';
import { TradingTester } from '../tester';

(async () => {
	// const [x, y, z, n] = await evolution({
	// 	chromosomeSize: 4,
	// 	maxGenerations: 1000,
	// 	poolSize: 100,
	// 	searchSpace: [0, 10],
	// 	precision: 10,
	// 	enableLogging: true,
	// 	fitness: ([x, y, z, n]) =>
	// 		x > 1 && y > 1 && z > 1 && n > 1 && n < 10
	// 			? Math.abs(Math.pow(z, n) - (Math.pow(x, n) + Math.pow(y, n)))
	// 			: Number.MAX_SAFE_INTEGER,
	// });

	// console.log('source', `x ^ n + y ^ n = z ^ n`);
	// console.log(
	// 	'formula',
	// 	`${x} ^ ${n} + ${y} ^ ${n} = ${z} ^ ${n} (${Math.pow(x, n) + Math.pow(y, n)} = ${Math.pow(z, n)})`,
	// );
	// console.log(x, y, z, n);

	const [x, y] = await evolution({
		chromosomeSize: 2,
		maxGenerations: 1000,
		poolSize: 100,
		searchSpace: [-5, 5],
		precision: 1000000,
		enableLogging: true,
		fitness: ([x, y]) => Math.abs(0 - (Math.pow(Math.pow(x, 2) + y - 11, 2) + Math.pow(x + Math.pow(y, 2) - 7, 2))),
	});

	console.log('source', `(x ^ 2 + y - 11) ^ 2 + (x + y ^ 2 - 7) ^ 2`);
	console.log(
		'formula',
		`(${x} ^ 2 + ${y} - 11) ^ 2 + (${x} + ${y} ^ 2 - 7) ^ 2 (${
			Math.pow(Math.pow(x, 2) + y - 11, 2) + Math.pow(x + Math.pow(y, 2) - 7, 2)
		})`,
	);
	console.log(x, y);
})();

export type TradingTesterEntryProps = {};

const TradingTesterEntry: React.FC<TradingTesterEntryProps> = props => {
	return null;

	return <TradingTester variant='price-tracking' />;
};

export default TradingTesterEntry;
