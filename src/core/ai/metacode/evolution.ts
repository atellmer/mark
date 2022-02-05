import { random, mean, randomInt } from '@utils/math';
import { Sample } from '../sample';
import { MetaContext, MetaContextOptions } from './shared';
import { OperatorNode } from './operator';

type EvolutionOptions = {
	samples: Array<Sample>;
	poolSize: number;
	maxGenerations: number;
	enableLogging?: boolean;
	mutationProb: number;
	crossProb: number;
} & Omit<MetaContextOptions, 'sample' | 'sampleLength' | 'constantNodeProp' | 'parameterNodeProp'>;

function evolution(options: EvolutionOptions): OperatorNode {
	const { samples, poolSize, maxGenerations, searchSpace, mutationProb, crossProb, maxDepth, enableLogging } = options;
	const [firstSample] = samples;
	const sampleLength = firstSample.getLength();

	MetaContext.init({
		sampleLength,
		searchSpace,
		constantNodeProp: 0.33333,
		parameterNodeProp: 0.33333,
		maxDepth,
	});

	let population = fill({
		population: [],
		poolSize,
	});
	let minError = Infinity;
	let avgError = Infinity;
	let alfa: OperatorNode = null;

	function log(...args) {
		if (!enableLogging) return;

		console.log(...args);
	}

	function fitness(program: OperatorNode): number {
		let error = 0;

		for (const sample of samples) {
			MetaContext.setPattern(sample.getPattern());
			const result = program.evaluate();

			if (Number.isNaN(result)) return Infinity;

			error += Math.abs(sample.getLabel() - result);
		}

		return error;
	}

	function iteration() {
		for (const program of population) {
			const error = fitness(program);

			if (error < minError) {
				minError = error;
				alfa = program;
			}

			program.setError(error);
			program.incrementLifetime();
		}

		alfa = alfa.clone();
		avgError = mean(population.map(x => x.getError()).filter(x => x < Infinity));

		if (minError === 0) return true;

		population = fill({
			population: [alfa, ...mutate(cross(select(population, avgError, poolSize), crossProb), mutationProb)],
			poolSize,
		});

		return false;
	}

	let logError = minError;

	for (let i = 0; i < maxGenerations; i++) {
		const stop = iteration();

		if (minError < logError || i === maxGenerations - 1 || stop) {
			log('generation #: ', i + 1);
			log('min error: ', minError);
			logError = minError;
		}

		if (stop) break;
	}

	return alfa;
}

function select(population: Array<OperatorNode>, avgError: number, poolSize: number): Array<OperatorNode> {
	let selected: Array<OperatorNode> = [];
	const maxLifetime = 1000;

	for (const x of population) {
		if (x.getError() === Infinity) continue;
		if (x.getError() < avgError || x.getLifetime() < maxLifetime) {
			selected.push(x);
		}
	}

	selected.sort((a, b) => (a.getError() > b.getError() ? 1 : -1));

	selected = selected.slice(0, poolSize);

	return selected;
}

function cross(population: Array<OperatorNode>, prob: number): Array<OperatorNode> {
	const children: Array<OperatorNode> = [];

	for (const x of population) {
		if (random(0, 1) <= prob && population.length >= 2) {
			const y = selectCrossPartner(x, population);

			children.push(x.cross(y));
		}
	}

	population.push(...children);

	return population;
}

function selectCrossPartner(x: OperatorNode, population: Array<OperatorNode>) {
	const idx = randomInt(0, population.length - 1);
	const y = population[idx];

	if (x === y) return selectCrossPartner(x, population);

	return y;
}

function mutate(population: Array<OperatorNode>, prob: number): Array<OperatorNode> {
	for (const x of population) {
		if (random(0, 1) < prob) {
			x.mutate(prob);
		}
	}

	return population;
}

type FillOptions = {
	population: Array<OperatorNode>;
} & Pick<EvolutionOptions, 'poolSize'>;

function fill(options: FillOptions): Array<OperatorNode> {
	const { population, poolSize } = options;

	while (population.length < poolSize) {
		population.push(OperatorNode.createRandomNode());
	}

	return population;
}

export { evolution };

// const alfa = evolution({
// 	samples: [
// 		new Sample([26, 35], 829),
// 		new Sample([8, 24], 141),
// 		new Sample([20, 1], 467),
// 		new Sample([33, 11], 1215),
// 		new Sample([37, 16], 1517),
// 	],
// 	poolSize: 1000,
// 	maxGenerations: 1000,
// 	searchSpace: [-10, 10],
// 	mutationProb: 0.5,
// 	crossProb: 0.9,
// 	maxDepth: 5,
// 	enableLogging: true,
// });

// console.log('alfa program', alfa);
// console.log('alfa print', alfa.print());
// console.log('alfa predict', alfa.predict([7, 3]));
