import React from 'react';

import { BoxProps } from '@ui/box';
import { Root } from './styled';

export type MaterialCardProps = {
	appearance?: 'paper';
	elevation?: number;
	hoverElevation?: number;
	fullWidth?: boolean;
} & BoxProps;

const MaterialCard: React.FC<MaterialCardProps> = props => {
	return <Root display='inline-block' {...props} />;
};

MaterialCard.defaultProps = {
	appearance: 'paper',
	elevation: 1,
	hoverElevation: 3,
	padding: 16,
};

export { MaterialCard };
