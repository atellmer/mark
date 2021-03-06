function detectIsFunction(x: unknown): x is Function {
	return typeof x === 'function';
}

function detectIsUndefined(x: unknown): x is undefined {
	return typeof x === 'undefined';
}

function detectIsNumber(x: unknown): x is Number {
	return typeof x === 'number';
}

function groupBy<T>(elements: Array<T>, selector: (x: T) => string | number): Record<string, Array<T>> {
	const map: Record<string, Array<T>> = {};

	for (const x of elements) {
		const key = selector(x);

		if (!map[key]) {
			map[key] = [];
		}

		map[key].push(x);
	}

	return map;
}

function createObjectMap<T = any>(items: Array<T> = [], getID: (item: T) => number | string): Record<string, T> {
	return items.reduce((acc, x) => ((acc[getID(x)] = x), acc), {});
}

function createListFromMap<T = any>(map: Record<string, T> = {}): Array<T> {
	return Object.keys(map).reduce((acc, key) => (acc.push(map[key]), acc), []);
}

function fillEnd(str: string, size: number, value: string) {
	while (str.length < size) {
		str += value;
	}

	return str;
}

function extractKeysToArray<T = string>(object: object, transformKey: (key) => T = x => x) {
	return object ? Object.keys(object).map(key => transformKey(key)) : [];
}

export {
	detectIsFunction,
	detectIsUndefined,
	detectIsNumber,
	groupBy,
	createObjectMap,
	createListFromMap,
	fillEnd,
	extractKeysToArray,
};
