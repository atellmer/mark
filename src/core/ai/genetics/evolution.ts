import { random } from '@utils/math';
import { Chromosome } from './chromosome';

type EvolutionOptions = {
	variant: 'maximization' | 'minimization';
	poolSize: number;
	chromosomeSize: number;
	maxIterations: number;
	searchSpace?: [number, number];
	mutationProb?: number;
	crossProb?: number;
	fitness: (parameters: Array<number>) => number | Promise<number>;
};

function evolution(options: EvolutionOptions): Promise<Array<number>> {
	const {
		variant,
		poolSize,
		chromosomeSize,
		maxIterations,
		searchSpace = [0, Number.MAX_SAFE_INTEGER],
		mutationProb = 0.1,
		crossProb = 0.5,
		fitness,
	} = options;
	const isMaxi = variant === 'maximization';
	let chromosomes: Array<Chromosome> = fill({
		chromosomes: [],
		chromosomeSize,
		poolSize,
		searchSpace,
	});
	let results: Array<FitnessResult> = [];
	let best: Chromosome = null;
	let bestResult = isMaxi ? -Infinity : Infinity;

	function iteration() {
		return new Promise(async resolve => {
			for (const chromosome of chromosomes) {
				const result = await fitness(Chromosome.decode(chromosome.getGenes()));

				if (isMaxi) {
					if (result > bestResult) {
						bestResult = result;
					}
				} else {
					if (result < bestResult) {
						bestResult = result;
					}
				}

				results.push({ result, chromosome });
			}

			chromosomes = [];

			results.sort(isMaxi ? maxToMin : minToMax);

			best = Chromosome.clone(results[0].chromosome);

			if (!isMaxi && bestResult === 0) {
				resolve(true);
			}

			chromosomes.push(best, ...mutate(cross(survive(results), crossProb, poolSize), mutationProb));

			chromosomes = fill({
				chromosomes,
				chromosomeSize,
				poolSize,
				searchSpace,
			});

			results = [];

			resolve(false);
		});
	}

	return new Promise(async resolve => {
		for (let i = 0; i < maxIterations; i++) {
			const stop = await iteration();

			if (stop) break;
		}

		resolve(Chromosome.decode(best.getGenes()));
	});
}

function survive(results: Array<FitnessResult>): Array<Chromosome> {
	const kill = Math.round(results.length / 4);

	results.splice(kill);

	return results.map(x => x.chromosome);
}

function mutate(chromosomes: Array<Chromosome>, prob: number): Array<Chromosome> {
	for (const chromosome of chromosomes) {
		if (random(0, 1) <= prob) {
			chromosome.mutate();
		}
	}

	return chromosomes;
}

function cross(chromosomes: Array<Chromosome>, prob: number, poolSize: number): Array<Chromosome> {
	const children: Array<Chromosome> = [];
	const over = 2;

	for (const chromosome of chromosomes) {
		if (chromosomes.length + children.length + over >= poolSize) break;
		if (random(0, 1) <= prob) {
			const idx = Math.round(random(0, chromosomes.length - 1));

			children.push(...Chromosome.cross(chromosome, chromosomes[idx]));
		}
	}

	chromosomes.push(...children);

	return chromosomes;
}

type CompleteOptions = {
	chromosomes: Array<Chromosome>;
} & Pick<EvolutionOptions, 'poolSize' | 'searchSpace' | 'chromosomeSize'>;

function fill(options: CompleteOptions) {
	const { chromosomes, poolSize, searchSpace, chromosomeSize } = options;
	const [minValue, maxValue] = searchSpace;

	while (chromosomes.length < poolSize) {
		const source = [];

		for (let j = 0; j < chromosomeSize; j++) {
			source.push(random(minValue > 0 ? minValue : 0, maxValue));
		}

		chromosomes.push(new Chromosome(source));
	}

	return chromosomes;
}

type FitnessResult = {
	result: number;
	chromosome: Chromosome;
};

const maxToMin = (a: FitnessResult, b: FitnessResult) => (a.result - b.result > 0 ? -1 : 1);

const minToMax = (a: FitnessResult, b: FitnessResult) => (a.result - b.result > 0 ? 1 : -1);

export { evolution };
