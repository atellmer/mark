import { random, randomInt, mean, fix } from '@utils/math';
import { Chromosome } from './chromosome';

type EvolutionOptions = {
	poolSize: number;
	chromosomeSize: number;
	maxGenerations: number;
	searchSpace: [number, number];
	precision: number;
	mutationProb?: number;
	crossProb?: number;
	enableLogging?: boolean;
	fitness: (parameters: Array<number>) => number | Promise<number>;
};

function evolution(options: EvolutionOptions): Promise<Array<number>> {
	const {
		poolSize,
		chromosomeSize,
		maxGenerations,
		searchSpace,
		precision,
		mutationProb = 0.1,
		crossProb = 0.9,
		fitness,
		enableLogging,
	} = options;
	let population: Array<Chromosome> = fill({
		population: [],
		chromosomeSize,
		poolSize,
		precision,
	});
	const intervals = getIntervals(searchSpace, precision);
	let minScore = Infinity;
	let avgScore = Infinity;
	let alfa: Chromosome = null;

	function log(...args) {
		if (!enableLogging) return;

		console.log(...args);
	}

	function iteration() {
		return new Promise(async resolve => {
			for (const chromosome of population) {
				const score = await fitness(getParameters(Chromosome.decode(chromosome.getGenes()), intervals));

				if (score < minScore) {
					minScore = score;
					alfa = chromosome;
				}

				chromosome.setScore(score);
			}

			alfa = Chromosome.clone(alfa);
			avgScore = mean(population.map(x => x.getScore()));

			if (minScore === 0) return resolve(true);

			population = fill({
				population: mutate(cross(select(population, avgScore, poolSize), crossProb), precision, mutationProb),
				chromosomeSize,
				poolSize,
				precision,
			});

			resolve(false);
		});
	}

	return new Promise(async resolve => {
		for (let i = 0; i < maxGenerations; i++) {
			const stop = await iteration();
			log('generation #: ', i + 1);
			log('min score: ', minScore);
			log('avg score: ', avgScore);

			if (stop) break;
		}

		resolve(getParameters(Chromosome.decode(alfa.getGenes()), intervals));
	});
}

function getParameters(values: Array<number>, intervals: Array<number>) {
	const parameters = values.map(x => intervals[x]);

	return parameters;
}

function getIntervals(space: [number, number], precision: number) {
	const intervals: Array<number> = [];
	const [min, max] = space;
	const step = (Math.abs(min) + Math.abs(max)) / precision;

	for (let i = min; i <= max; i += step) {
		intervals.push(fix(i, 5));
	}

	return intervals;
}

function select(population: Array<Chromosome>, avgScore: number, poolSize: number) {
	const selected = [];

	for (const x of population) {
		if (x.getScore() < avgScore) {
			selected.push(x);
		}
	}

	return selected.slice(0, poolSize);
}

function mutate(population: Array<Chromosome>, precision: number, prob: number): Array<Chromosome> {
	for (const x of population) {
		if (random(0, 1) <= prob) {
			x.mutate(precision);
		}
	}

	return population;
}

function cross(population: Array<Chromosome>, prob: number): Array<Chromosome> {
	const children: Array<Chromosome> = [];

	for (const x of population) {
		if (random(0, 1) <= prob && population.length >= 2) {
			const y = selectCrossPartner(x, population);

			children.push(Chromosome.cross(x, y));
		}
	}

	population.push(...children);

	return population;
}

function selectCrossPartner(x: Chromosome, population: Array<Chromosome>) {
	const idx = randomInt(0, population.length - 1);
	const y = population[idx];

	if (x === y) return selectCrossPartner(x, population);

	return y;
}

type CompleteOptions = {
	population: Array<Chromosome>;
} & Pick<EvolutionOptions, 'poolSize' | 'precision' | 'chromosomeSize'>;

function fill(options: CompleteOptions) {
	const { population, poolSize, precision, chromosomeSize } = options;

	while (population.length < poolSize) {
		const source = [];

		for (let j = 0; j < chromosomeSize; j++) {
			source.push(randomInt(0, precision));
		}

		population.push(new Chromosome(source));
	}

	return population;
}

export { evolution };
