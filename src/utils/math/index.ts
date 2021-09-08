import * as math from 'mathjs';

function mean(values: Array<number>): number {
	return math.mean(values);
}

function pow(x: number, y: number): number {
	return math.pow(x, y) as number;
}

function sqrt(x: number): number {
	return math.sqrt(x);
}

function exp(x: number): number {
	return math.exp(x);
}

function random(min?: number, max?: number): number {
	return math.random(min, max);
}

function abs(x: number): number {
	return math.abs(x);
}

function log(x: number): number {
	return math.log(x);
}

export { mean, pow, sqrt, exp, random, abs, log };
