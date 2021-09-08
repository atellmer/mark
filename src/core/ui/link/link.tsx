import React from 'react';

import { BoxProps } from '../box';
import { Root } from './styled';

export type LinkProps = {
	to?: string;
} & BoxProps &
	React.AnchorHTMLAttributes<{}>;

const Link: React.FC<LinkProps> = props => {
	return <Root {...props} />;
};

Link.defaultProps = {
	component: 'a',
};

export { Link };
