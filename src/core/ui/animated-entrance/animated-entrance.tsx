import React from 'react';

import { BoxProps } from '@ui/box';
import { Root } from './styled';

export type AnimatedEntranceProps = {} & Partial<BoxProps>;

const AnimatedEntrance: React.FC<AnimatedEntranceProps> = props => {
	return <Root {...props} />;
};

export { AnimatedEntrance };
