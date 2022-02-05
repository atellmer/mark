function mean(values: Array<number>): number {
	return values.reduce((acc, x) => ((acc += x), acc), 0) / values.length;
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

function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
	return Math.round(random(min, max));
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

function fix(x: number, precision = 4): number {
	return Number(x.toFixed(precision));
}

function sd(values: Array<number>): number {
	const length = values.length;
	if (length === 1) return values[0];
	const average = mean(values);
	let stddev = 0.0;

	for (const x of values) {
		stddev += pow(x - average, 2);
	}

	stddev = sqrt(stddev / (length - 1)) || 0.0000000001;

	return stddev;
}

function minimax(values: Array<number>, interval: [number, number]): Array<number> {
	const a = interval[0];
	const b = interval[1];
	const xMin = min(values);
	const xMax = max(values);
	const normal = [];

	for (let i = 0; i < values.length; i++) {
		normal[i] = fix(a + ((values[i] - xMin) / (xMax - xMin)) * (b - a), 4);
	}

	return normal;
}

function zscore(values: Array<number>) {
	const average = mean(values);
	const stdev = sd(values);
	const normal = [];

	for (let i = 0; i < values.length; i++) {
		normal[i] = fix((values[i] - average) / stdev, 4);
	}

	return normal;
}

function sum(values: Array<number>) {
	let total = 0;

	for (const value of values) {
		total += value;
	}

	return total;
}

export { mean, pow, sqrt, exp, random, randomInt, abs, log, min, max, fix, sd, minimax, zscore, sum };
