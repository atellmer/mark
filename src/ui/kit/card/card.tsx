import React from 'react';

import { BoxProps } from '@ui/kit/box';
import { Root } from './styled';

export type CardProps = {
	elevation?: number;
	hoverElevation?: number;
	fullWidth?: boolean;
} & BoxProps;

const Card: React.FC<CardProps> = props => {
	return <Root display='inline-block' {...props} />;
};

Card.defaultProps = {
	elevation: 1,
	hoverElevation: 3,
	padding: 16,
};

export { Card };
