import styled from 'styled-components';
import { animated } from 'react-spring';

const Root = styled(animated.div)`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(62, 71, 87, 0.7);
	z-index: 1000;
`;

export { Root };
