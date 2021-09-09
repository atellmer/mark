import * as mathjs from 'mathjs';

function mean(values: Array<number>): number {
	return mathjs.mean(values);
}

function pow(x: number, y: number): number {
	return Math.pow(x, y);
}

function sqrt(x: number): number {
	return Math.sqrt(x);
}

function exp(x: number): number {
	return Math.exp(x);
}

function random(min?: number, max?: number): number {
	return mathjs.random(min, max);
}

function abs(x: number): number {
	return Math.abs(x);
}

function log(x: number): number {
	return Math.log(x);
}

function min(values: Array<number>): number {
	return Math.min(...values);
}

function max(values: Array<number>): number {
	return Math.max(...values);
}

function fixed(x: number): number {
	return Number(x.toFixed(2));
}

export { mean, pow, sqrt, exp, random, abs, log, min, max, fixed };
