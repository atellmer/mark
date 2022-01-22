import { randomInt } from '@utils/math';

class Gene {
	private value: number;

	constructor(source: number) {
		this.value = source;
	}

	public getValue(): number {
		return this.value;
	}

	public mutate(precision: number) {
		const bin = encodeBinary(this.value).split('');
		const idx = randomInt(0, bin.length - 1);

		bin[idx] = bin[idx] === '1' ? '0' : '1';

		const newValue = decodeBinary(bin.join(''));

		if (newValue >= 0 && newValue <= precision) {
			this.value = newValue;
		}
	}
}

function encodeBinary(value: number): string {
	return value.toString(2);
}

function decodeBinary(value: string): number {
	return parseInt(value, 2);
}

export { Gene };
