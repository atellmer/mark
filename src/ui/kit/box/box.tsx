import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { getMeasureProp } from '@utils/styles';

export type BoxProps = {
	component?: any;
	as?: never;
	position?: 'static' | 'absolute' | 'relative' | 'fixed';
	fullWidth?: boolean;
	zIndex?: number;
	top?: string | number;
	right?: string | number;
	bottom?: string | number;
	left?: string | number;
	fontSize?: string | number;
	fontWeight?: string | number;
	fontStyle?: 'normal' | 'italic';
	lineHeight?: string | number;
	textAlign?: 'left' | 'center' | 'right' | 'justify';
	textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitilize';
	textDecoration?: 'none' | 'underline' | 'line-through';
	whiteSpace?: 'normal' | 'nowrap';
	color?: string;
	width?: string | number;
	height?: string | number;
	minWidth?: string | number;
	maxWidth?: string | number;
	minHeight?: string | number;
	maxHeight?: string | number;
	padding?: string | number;
	paddingTop?: string | number;
	paddingRight?: string | number;
	paddingBottom?: string | number;
	paddingLeft?: string | number;
	margin?: string | number;
	marginTop?: string | number;
	marginRight?: string | number;
	marginBottom?: string | number;
	marginLeft?: string | number;
	backgroundColor?: string;
	backgroundPosition?: string;
	backgroundSize?: string;
	backgroundRepeat?: string;
	border?: string;
	display?: 'inline' | 'inline-block' | 'block' | 'flex' | 'inline-flex';
	flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	flexWrap?: 'wrap' | 'nowrap';
	flexFlow?: string;
	justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'baseline' | 'stretch';
	alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
	alignContent?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' | 'space-between' | 'space-around';
	flexGrow?: number;
	flexShrink?: number;
	flexBasis?: string | number;
	order?: number;
	flex?: string;
	alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
	transform?: string;
} & React.DOMAttributes<{}> &
	React.AllHTMLAttributes<{}>;

const blackListForwardPropsMap = {
	width: true,
	height: true,
	display: true,
	fontSize: true,
	fontWeight: true,
	fontStyle: true,
	color: true,
	backgroundColor: true,
	position: true,
	top: true,
	right: true,
	bottom: true,
	left: true,
	margin: true,
	padding: true,
};

const shouldForwardProp = (prop: string, defaultValidatorFn: Function) => {
	return !blackListForwardPropsMap[prop] && defaultValidatorFn(prop);
};

const StyledElement = styled.div.withConfig({
	shouldForwardProp,
})`
	${(p: BoxProps) => makePosition(p)}
	${(p: BoxProps) => makeTypography(p)}
	${(p: BoxProps) => makeContainer(p)}
	${(p: BoxProps) => makeFlex(p)}
	${(p: BoxProps) => makeTransform(p)}
`;

const Box: React.FC<BoxProps> = forwardRef((props, ref) => {
	const { children, component, ...rest } = props;

	return (
		<StyledElement ref={ref} as={component} {...rest}>
			{children}
		</StyledElement>
	);
});

function makeFlex(props: BoxProps) {
	const {
		display,
		flexDirection,
		flexWrap,
		flexFlow,
		justifyContent,
		alignItems,
		alignContent,
		flexGrow,
		flexShrink,
		flexBasis,
		flex,
		order,
		alignSelf,
	} = props;
	let css = '';

	if (display) {
		css += `
			display: ${display};
		`;
	}

	if (flexDirection) {
		css += `
			flex-direction: ${flexDirection};
		`;
	}

	if (flexWrap) {
		css += `
			flex-wrap: ${flexWrap};
		`;
	}

	if (flexFlow) {
		css += `
			flex-flow: ${flexFlow};
		`;
	}

	if (justifyContent) {
		css += `
			justify-content: ${justifyContent};
		`;
	}

	if (alignItems) {
		css += `
			align-items: ${alignItems};
		`;
	}

	if (alignContent) {
		css += `
			align-content: ${alignContent};
		`;
	}

	if (flexGrow) {
		css += `
			flex-grow: ${flexGrow};
		`;
	}

	if (flexShrink) {
		css += `
			flex-shrink: ${flexShrink};
		`;
	}

	if (flexBasis) {
		css += `
			flex-basis: ${flexBasis};
		`;
	}

	if (flex) {
		css += `
			flex: ${flex};
		`;
	}

	if (order) {
		css += `
			order: ${order};
		`;
	}

	if (alignSelf) {
		css += `
			align-self: ${alignSelf};
		`;
	}

	return css;
}

function makeContainer(props: BoxProps) {
	const {
		fullWidth,
		width,
		height,
		minWidth,
		maxWidth,
		minHeight,
		maxHeight,
		padding,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		margin,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		backgroundColor,
		backgroundPosition,
		backgroundSize,
		backgroundRepeat,
		border,
	} = props;
	let css = `
		box-sizing: border-box;
	`;

	if (fullWidth) {
		css += `
			width: 100%;
		`;
	}

	if (width) {
		css += `
			width: ${getMeasureProp(width)};
		`;
	}

	if (height) {
		css += `
			height: ${getMeasureProp(height)};
		`;
	}

	if (minWidth) {
		css += `
			min-width: ${getMeasureProp(minWidth)};
		`;
	}

	if (maxWidth) {
		css += `
			max-width: ${getMeasureProp(maxWidth)};
		`;
	}

	if (minHeight) {
		css += `
			min-height: ${getMeasureProp(minHeight)};
		`;
	}

	if (maxHeight) {
		css += `
			max-height: ${getMeasureProp(maxHeight)};
		`;
	}

	if (padding) {
		css += `
			padding: ${getMeasureProp(padding)};
		`;
	}

	if (paddingTop) {
		css += `
			padding-top: ${getMeasureProp(paddingTop)};
		`;
	}

	if (paddingRight) {
		css += `
			padding-right: ${getMeasureProp(paddingRight)};
		`;
	}

	if (paddingBottom) {
		css += `
			padding-bottom: ${getMeasureProp(paddingBottom)};
		`;
	}

	if (paddingLeft) {
		css += `
			padding-left: ${getMeasureProp(paddingLeft)};
		`;
	}

	if (margin) {
		css += `
			margin: ${getMeasureProp(margin)};
		`;
	}

	if (marginTop) {
		css += `
			margin-top: ${getMeasureProp(marginTop)};
		`;
	}

	if (marginRight) {
		css += `
			margin-right: ${getMeasureProp(marginRight)};
		`;
	}

	if (marginBottom) {
		css += `
			margin-bottom: ${getMeasureProp(marginBottom)};
		`;
	}

	if (marginLeft) {
		css += `
			margin-left: ${getMeasureProp(marginLeft)};
		`;
	}

	if (backgroundColor) {
		css += `
			background-color: ${backgroundColor};
		`;
	}

	if (backgroundPosition) {
		css += `
			background-position: ${backgroundPosition};
		`;
	}

	if (backgroundSize) {
		css += `
			background-size: ${backgroundSize};
		`;
	}

	if (backgroundRepeat) {
		css += `
			background-repeat: ${backgroundRepeat};
		`;
	}

	if (border) {
		css += `
			border: ${border};
		`;
	}

	return css;
}

function makeTypography(props: BoxProps) {
	const { fontSize, fontWeight, fontStyle, lineHeight, textAlign, textTransform, textDecoration, color, whiteSpace } =
		props;
	let css = '';

	if (typeof fontSize !== 'undefined') {
		css += `
			font-size: ${getMeasureProp(fontSize)};
		`;
	}

	if (fontWeight) {
		css += `
			font-weight: ${fontWeight};
		`;
	}

	if (fontStyle) {
		css += `
			font-style: ${fontStyle};
		`;
	}

	if (lineHeight) {
		css += `
			line-height: ${lineHeight};
		`;
	}

	if (textAlign) {
		css += `
			text-align: ${textAlign};
		`;
	}

	if (textTransform) {
		css += `
			text-transform: ${textTransform};
		`;
	}

	if (textDecoration) {
		css += `
			text-decoration: ${textDecoration};
		`;
	}

	if (color) {
		css += `
			color: ${color};
		`;
	}

	if (whiteSpace) {
		css += `
			white-space: ${whiteSpace};
		`;
	}

	return css;
}

function makePosition(props: BoxProps) {
	const { position, zIndex, top, right, left, bottom } = props;
	let css = '';

	if (position) {
		css += `
			position: ${position};
		`;
	}

	if (zIndex) {
		css += `
			z-index: ${zIndex};
		`;
	}

	if (typeof top !== 'undefined') {
		css += `
			top: ${getMeasureProp(top)};
		`;
	}

	if (typeof right !== 'undefined') {
		css += `
			right: ${getMeasureProp(right)};
		`;
	}

	if (typeof left !== 'undefined') {
		css += `
			left: ${getMeasureProp(left)};
		`;
	}

	if (typeof bottom !== 'undefined') {
		css += `
			bottom: ${getMeasureProp(bottom)};
		`;
	}

	return css;
}

function makeTransform(props: BoxProps) {
	const { transform } = props;
	let css = '';

	if (transform) {
		css += `
			transform: ${transform};
		`;
	}

	return css;
}

export { Box };
