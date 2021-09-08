import React from 'react';
import { useMemo } from 'react';

import { Root, Cover, Indicator } from './styled';

export type SoftFetchingProps = {
	appearance?: 'fixed-indicator';
	isFetching: boolean;
};

const SoftFetching: React.FC<SoftFetchingProps> = ({ isFetching, appearance, children }) => {
	const momized = useMemo(() => {
		return children;
	}, [isFetching]);
	const isFixed = appearance === 'fixed-indicator';

	return (
		<Root>
			<Cover isFetching={isFetching}>{isFetching ? momized : children}</Cover>
			{isFetching && <Indicator isFixed={isFixed} />}
		</Root>
	);
};

export { SoftFetching };
