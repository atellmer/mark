import { random } from '@utils/math';
import { fillEnd } from '@utils/helpers';
import { Gene } from './gene';

class Chromosome {
	private genes: Array<Gene>;

	constructor(source: Array<number>) {
		this.genes = source.map(x => new Gene(x));
	}

	public mutate() {
		const idx = Math.round(random(0, this.genes.length - 1));
		const gene = this.genes[idx];

		gene.mutate();
	}

	public getGenes(): Array<Gene> {
		return this.genes;
	}

	static decode(genes: Array<Gene>): Array<number> {
		return genes.map(x => Gene.decode(x.getValue()));
	}

	static clone(chromosome: Chromosome): Chromosome {
		return new Chromosome(Chromosome.decode(chromosome.getGenes()));
	}

	static cross(chromosomeOne: Chromosome, chromosomeTwo: Chromosome): [Chromosome, Chromosome] {
		const setOne = chromosomeOne.getGenes().map(x => x.getValue().join(''));
		const setTwo = chromosomeTwo.getGenes().map(x => x.getValue().join(''));
		const childSourceOne: Array<string> = [];
		const childSourceTwo: Array<string> = [];

		for (let i = 0; i < setOne.length; i++) {
			let valueOne = setOne[i];
			let valueTwo = setTwo[i];

			const size = valueOne.length > valueTwo.length ? valueOne.length : valueTwo.length;
			const idx = Math.round(random(0, size - 1));

			valueOne = fillEnd(valueOne, size, '0');
			valueTwo = fillEnd(valueTwo, size, '0');

			const sliceLeftOne = valueOne.slice(0, idx);
			const sliceRightOne = valueOne.slice(idx, valueOne.length);
			const sliceLeftTwo = valueTwo.slice(0, idx);
			const sliceRightTwo = valueTwo.slice(idx, valueTwo.length);

			childSourceOne.push(sliceLeftOne + sliceRightTwo);
			childSourceTwo.push(sliceLeftTwo + sliceRightOne);
		}

		const childChromosomeOne = new Chromosome(childSourceOne.map(x => Gene.decode(x.split(''))));
		const childChromosomeTwo = new Chromosome(childSourceTwo.map(x => Gene.decode(x.split(''))));

		return [childChromosomeOne, childChromosomeTwo];
	}
}

export { Chromosome };
