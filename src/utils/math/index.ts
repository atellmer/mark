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

function min(values: Array<number>): number {
	return math.min(values);
}

function max(values: Array<number>): number {
	return math.max(values);
}

function fixed(x: number): number {
	return Number(x.toFixed(2));
}

export { mean, pow, sqrt, exp, random, abs, log, min, max, fixed };
