import styled from 'styled-components';

const Root = styled.div`
	position: relative;

	& .legend {
		position: absolute;
		left: 12px;
		top: 12px;
		z-index: 1;
		font-size: 12px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

export { Root };
