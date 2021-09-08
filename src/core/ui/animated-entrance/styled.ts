import styled, { keyframes } from 'styled-components';

import { Box } from '@ui/box';

const enterMotion = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

const Root = styled(Box)`
	animation-name: ${enterMotion};
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-timing-function: ease-in-out;
`;

export { Root };
