import { random } from '@utils/math';
import { Chromosome } from './chromosome';

type EvolutionOptions = {
	poolSize: number;
	chromosomeSize: number;
	maxIterations?: number;
	searchSpace?: [number, number];
	mutationProb?: number;
	crossProb?: number;
	fitness: (parameters: Array<number>) => number;
};

function evolution(options: EvolutionOptions): Array<number> {
	const {
		poolSize,
		chromosomeSize,
		maxIterations = Infinity,
		searchSpace = [0, Number.MAX_SAFE_INTEGER],
		mutationProb = 0.1,
		crossProb = 0.5,
		fitness,
	} = options;
	let population: Array<Chromosome> = fill({
		population: [],
		chromosomeSize,
		poolSize,
		searchSpace,
	});
	let results: Array<FitnessResult> = [];
	let best: Chromosome = null;
	let minDistance = Infinity;

	function iteration() {
		for (const chromosome of population) {
			const distance = fitness(Chromosome.decode(chromosome.getGenes()));

			if (distance < minDistance) {
				minDistance = distance;
			}

			results.push({ distance, chromosome });
		}

		population = [];

		results.sort((a, b) => a.distance - b.distance);

		best = Chromosome.clone(results[0].chromosome);

		if (minDistance === 0) return true;

		population.push(best, ...mutate(cross(survive(results), crossProb), mutationProb));

		population = fill({
			population,
			chromosomeSize,
			poolSize,
			searchSpace,
		});

		results = [];

		return false;
	}

	for (let i = 0; i < maxIterations; i++) {
		if (iteration()) {
			break;
		}
	}

	const parameters = Chromosome.decode(best.getGenes());

	return parameters;
}

function survive(results: Array<FitnessResult>): Array<Chromosome> {
	results.splice(Math.round(results.length / 2));

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

function cross(chromosomes: Array<Chromosome>, prob: number): Array<Chromosome> {
	const children: Array<Chromosome> = [];

	for (const chromosome of chromosomes) {
		if (random(0, 1) <= prob) {
			const idx = Math.round(random(0, chromosomes.length - 1));

			children.push(...Chromosome.cross(chromosome, chromosomes[idx]));
		}
	}

	chromosomes.push(...children);

	return chromosomes;
}

type CompleteOptions = {
	population: Array<Chromosome>;
} & Pick<EvolutionOptions, 'poolSize' | 'searchSpace' | 'chromosomeSize'>;

function fill(options: CompleteOptions) {
	const { population, poolSize, searchSpace, chromosomeSize } = options;
	const [minValue, maxValue] = searchSpace;

	while (population.length < poolSize) {
		const source = [];

		for (let j = 0; j < chromosomeSize; j++) {
			source.push(random(minValue > 0 ? minValue : 0, maxValue));
		}

		population.push(new Chromosome(source));
	}

	return population;
}

type FitnessResult = {
	distance: number;
	chromosome: Chromosome;
};

export { evolution };
