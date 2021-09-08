import React from 'react';

import { IconBase, IconBaseProps } from './base';

export type SuccessIconProps = IconBaseProps;

const SuccessIcon: React.FC<IconBaseProps> = props => {
	return (
		<IconBase {...props}>
			<svg
				stroke='currentColor'
				fill='none'
				strokeWidth='2'
				viewBox='0 0 24 24'
				strokeLinecap='round'
				strokeLinejoin='round'
				xmlns='http://www.w3.org/2000/svg'>
				<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
				<polyline points='22 4 12 14.01 9 11.01'></polyline>
			</svg>
		</IconBase>
	);
};

export { SuccessIcon };
