import React from 'react';

import { IconBase, IconBaseProps } from './base';

export type CheckboxUncheckedIconProps = IconBaseProps;

const CheckboxUncheckedIcon: React.FC<CheckboxUncheckedIconProps> = props => {
	return (
		<IconBase {...props}>
			<svg
				stroke='currentColor'
				fill='currentColor'
				strokeWidth='0'
				version='1.1'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'>
				<path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' />
			</svg>
		</IconBase>
	);
};

export { CheckboxUncheckedIcon };
