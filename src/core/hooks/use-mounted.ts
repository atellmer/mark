import { useMemo, useEffect } from 'react';

function useMounted() {
	const scope = useMemo(() => ({ value: false }), []);

	useEffect(() => {
		scope.value = true;

		return () => (scope.value = false);
	}, []);

	return {
		mounted: () => scope.value,
	};
}

export { useMounted };
