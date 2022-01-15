import { random } from '@utils/math';

class Gene {
	private source: number;
	private value: Array<string>;

	constructor(source: number) {
		this.source = source;
		this.value = Gene.encode(source);
	}

	public getSource(): number {
		return this.source;
	}

	public getValue(): Array<string> {
		return this.value;
	}

	public mutate() {
		const idx = Math.round(random(0, this.value.length - 1));
		const value = Number(this.value[idx]);
		const mutated = value === 1 ? 0 : 1;

		this.value[idx] = mutated.toString();
		this.source = Gene.decode(this.value);
	}

	static encode(source: number): Array<string> {
		return encodeBin(source).split('');
	}

	static decode(value: Array<string>): number {
		return decodeBin(value.join(''));
	}
}

function encodeBin(value: number): string {
	return (value >>> 0).toString(2);
}

function decodeBin(value: string): number {
	return parseInt(value, 2);
}

export { Gene };
