function detectIsFunction(x: unknown): x is Function {
	return typeof x === 'function';
}
function detectIsUndefined(x: unknown): x is undefined {
	return typeof x === 'undefined';
}

function groupBy<T>(elements: Array<T>, selector: (x: T) => string | number): Record<string, Array<T>> {
	const map: Record<string, Array<T>> = {};

	for (const x of elements) {
		const key = selector(x);

		if (!key) continue;

		if (!map[key]) {
			map[key] = [];
		}

		map[key].push(x);
	}

	return map;
}

function createListFromMap<T = any>(map: Record<string, T> = {}): Array<T> {
	return Object.keys(map).reduce((acc, key) => (acc.push(map[key]), acc), []);
}

function keysCount<T extends object>(value: T): number {
	return Object.keys(value).length;
}

export { detectIsFunction, detectIsUndefined, groupBy, createListFromMap, keysCount };
