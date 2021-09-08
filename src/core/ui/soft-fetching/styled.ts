import styled, { css, keyframes } from 'styled-components';

const Root = styled.div`
	position: relative;
`;

type CoverProps = {
	isFetching: boolean;
};

const Cover = styled.div<CoverProps>`
	position: relative;
	transition: opacity 0.6s ease-in-out;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;
		opacity: 1;
		visibility: hidden;
	}

	${p =>
		p.isFetching &&
		css`
			pointer-events: none;
			opacity: 0.4;

			& * {
				pointer-events: none;
				user-select: none;
			}

			&::after {
				visibility: visible;
			}
		`}
`;

const pulseMotion = keyframes`
	0%,
	80%,
	100% {
		box-shadow: 0 0;
		height: 4em;
	}
	40% {
		box-shadow: 0 -2em;
		height: 5em;
	}
`;

type IndicatorProps = {
	isFixed: boolean;
};

const Indicator = styled.div<IndicatorProps>`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, calc(-50% + 10px));
	font-size: 8px;
	animation: ${pulseMotion} 1s infinite ease-in-out;
	width: 1em;
	height: 4em;
	animation-delay: -0.16s;
	z-index: 20;

	${p =>
		p.isFixed &&
		css`
			position: fixed;
		`}

	${p => css`
		color: ${p.theme.palette.accent};
		background-color: ${p.theme.palette.accent};

		&::before,
		&::after {
			position: absolute;
			top: 0;
			content: '';
			background-color: ${p.theme.palette.accent};
			animation: ${pulseMotion} 1s infinite ease-in-out;
			width: 1em;
			height: 4em;
		}
	`}

	&::before {
		left: -1.5em;
		animation-delay: -0.32s;
	}

	&::after {
		left: 1.5em;
	}
`;

export { Root, Cover, Indicator };
