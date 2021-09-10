const searchToParams = (search: string): Record<string, string | number> => {
	const result: Record<string, string | number> = {};

	(search || '')
		.replace(/^[?#]/, '')
		.split('&')
		.forEach(item => {
			const [key, encodedValue] = item.split('=');
			const value = decodeURIComponent(encodedValue);

			if (key) {
				if (/^[{[].+?[}\]]$/.test(value)) {
					result[key] = JSON.parse(value);
				} else if (/^\d+$/.test(value)) {
					result[key] = Number(value);
				} else {
					result[key] = value;
				}
			}
		});

	return result;
};

const paramsToSearch = (params: Record<string, string | number>): string => {
	return Object.keys(params)
		.map(key => {
			const isEmpty = params[key] === '';

			return isEmpty ? '' : `${key}=${params[key]}&`;
		})
		.join('')
		.replace(/&$/, '');
};

export { searchToParams, paramsToSearch };
