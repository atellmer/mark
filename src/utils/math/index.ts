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

function sd(values: Array<number>) {
	const length = values.length;
	if (length === 1) return values[0];
	const average = mean(values);
	let stddev = 0.0;

	for (const x of values) {
		stddev += pow(x - average, 2);
	}

	stddev = sqrt(stddev / (length - 1));

	return stddev;
}

export { mean, pow, sqrt, exp, random, abs, log, min, max, fix, sd };
