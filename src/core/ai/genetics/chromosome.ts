import { random, randomInt } from '@utils/math';
import { Gene } from './gene';

class Chromosome {
	private genes: Array<Gene>;
	private score = Infinity;

	constructor(source: Array<number>) {
		this.genes = source.map(x => new Gene(x));
	}

	public getGenes(): Array<Gene> {
		return this.genes;
	}

	public getSize(): number {
		return this.genes.length;
	}

	public getScore(): number {
		return this.score;
	}

	public setScore(score: number) {
		this.score = score;
	}

	public mutate(precision: number) {
		const idx = randomInt(0, this.genes.length - 1);
		const gene = this.genes[idx];

		gene.mutate(precision);
	}

	static decode(genes: Array<Gene>): Array<number> {
		return genes.map(x => x.getValue());
	}

	static clone(chromosome: Chromosome): Chromosome {
		return new Chromosome(Chromosome.decode(chromosome.getGenes()));
	}

	static cross(x: Chromosome, y: Chromosome): Chromosome {
		const sourceOne = Chromosome.decode(x.getGenes());
		const sourceTwo = Chromosome.decode(y.getGenes());
		const idx = randomInt(0, x.getSize() - 1);
		const sliceLeftOne = sourceOne.slice(0, idx);
		const sliceRightOne = sourceOne.slice(idx, sourceOne.length);
		const sliceLeftTwo = sourceTwo.slice(0, idx);
		const sliceRightTwo = sourceTwo.slice(idx, sourceTwo.length);

		return random(0, 1) <= 0.5
			? new Chromosome([...sliceLeftOne, ...sliceRightTwo])
			: new Chromosome([...sliceLeftTwo, ...sliceRightOne]);
	}
}

export { Chromosome };
