import styled, { css, keyframes } from 'styled-components';

const createRippleEffect = (size: number) => keyframes`
	0% {
		opacity: 1;
		transform: scale(10);
	}
	100% {
		opacity: 0;
		transform: scale(${size * 2});
	}
`;

const Root = styled.div``;

type AnimatedProps = {
	top: number;
	left: number;
	during: number;
	color: string;
	size: number;
	inProgress: boolean;
};

const blackListForwardPropsMap = {
	color: true,
	size: true,
};

const shouldForwardProp = (prop: string, defaultValidatorFn: Function) => {
	return !blackListForwardPropsMap[prop] && defaultValidatorFn(prop);
};

const Animated = styled.span.withConfig({
	shouldForwardProp,
})<AnimatedProps>`
	position: absolute;
	width: 1px;
	height: 1px;
	border-radius: 50%;
	opacity: 0;
	transform-origin: center center;
	pointer-events: none;
	will-change: transform;

	${p =>
		p.color &&
		css`
			background-color: ${p.color};
		`}

	${p =>
		p.inProgress &&
		css`
			top: ${p.top}px;
			left: ${p.left}px;
			animation-name: ${createRippleEffect(p.size)};
			animation-duration: ${p.during}ms;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) 0ms;
			animation-iteration-count: 1;
		`}
`;

export { Root, Animated };
