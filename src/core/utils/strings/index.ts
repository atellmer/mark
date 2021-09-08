function capitalize(value: string) {
	if (!value) return '';
	const str = value[0].toUpperCase() + value.slice(1);

	return str;
}

function capitalizeSentence(value: string) {
	const [firstWord, ...rest] = value.split(' ');
	const str = capitalize(firstWord);

	return [str, ...rest].join(' ');
}

function comma(items: Array<string> = []) {
	return items.filter(Boolean).join(', ');
}

export { capitalize, capitalizeSentence, comma };
