import React from 'react';

import { IconBase, IconBaseProps } from './base';

export type ExclamationIconProps = IconBaseProps;

const ExclamationIcon: React.FC<IconBaseProps> = props => {
	return (
		<IconBase {...props}>
			<svg
				stroke='currentColor'
				fill='currentColor'
				strokeWidth='0'
				viewBox='0 0 16 16'
				xmlns='http://www.w3.org/2000/svg'>
				<path
					fillRule='evenodd'
					d='M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z'
					clipRule='evenodd'></path>
				<path d='M7.002 11a1 1 0 112 0 1 1 0 01-2 0zM7.1 4.995a.905.905 0 111.8 0l-.35 3.507a.552.552 0 01-1.1 0L7.1 4.995z'></path>
			</svg>
		</IconBase>
	);
};

export { ExclamationIcon };
