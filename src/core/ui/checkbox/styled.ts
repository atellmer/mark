import styled, { css, keyframes } from 'styled-components';

import { Ripple } from '@ui/ripple';
import { fade } from '@utils/styles';

const focusMotion = keyframes`
	0% {
		transform: scale(1);
	}
	60% {
		transform: scale(0.9);
	}
	100% {
		transform: scale(1);
	}
`;

const appearanceMotion = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

type RootProps = {
	isDisabled: boolean;
};

const Root = styled.label<RootProps>`
	position: relative;
	display: inline-flex;
	align-items: center;
	vertical-align: middle;
	font-size: 1rem;
	margin-left: -12px;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	line-height: normal;

	input::-ms-check {
		display: none;
	}

	* {
		cursor: pointer;
	}

	${p =>
		p.isDisabled &&
		css`
			cursor: not-allowed;

			* {
				cursor: not-allowed;
			}

			& > span {
				pointer-events: none;
			}

			color: ${p.theme.palette.label};
		`}
`;

const InputLayout = styled(Ripple)`
	position: relative;
	padding: 9px;
	vertical-align: middle;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.2s ease-in-out;
	border-radius: 50%;
	font-size: 0;

	${p => css`
		&:hover {
			background-color: ${fade(p.theme.palette.accent, 0.1)};
		}
	`}
`;

const Input = styled.input.attrs({
	type: 'checkbox',
})`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	appearance: none;

	${p => css`
		&:focus ~ span {
			background-color: ${fade(p.theme.palette.accent, 0.2)};
			animation-name: ${focusMotion};
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) 0ms;
			animation-duration: 2000ms;
			animation-iteration-count: infinite;
			animation-fill-mode: both;
		}
	`}
`;

const Outline = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
`;

const IconLayout = styled.span`
	font-size: 0;
	animation-name: ${appearanceMotion};
	animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	animation-duration: 600ms;
	animation-iteration-count: 1;
`;

export { Root, Input, InputLayout, Outline, IconLayout };
