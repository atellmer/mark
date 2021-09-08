import React from 'react';
import styled, { css } from 'styled-components';

import { Theme } from '@theme';

export type IconBaseProps = {
	color?: 'accent' | 'text';
	size?: number;
} & React.HTMLAttributes<unknown>;

const IconBase: React.FC<IconBaseProps> = props => {
	return <IconStyled {...props} />;
};

IconBase.defaultProps = {
	size: 16,
};

type IconStyledProps = IconBaseProps;

const blackListForwardPropsMap = {
	size: true,
	color: true,
};

const shouldForwardProp = (prop: string, defaultValidatorFn: Function) => {
	return !blackListForwardPropsMap[prop] && defaultValidatorFn(prop);
};

const IconStyled = styled.i.withConfig({
	shouldForwardProp,
})<IconStyledProps>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	color: currentColor;

	${p =>
		p.color &&
		getColor(p.color, p.theme) &&
		css`
			color: ${getColor(p.color, p.theme)};
		`}

	${p =>
		p.size &&
		css`
			width: ${p.size}px;
			height: ${p.size}px;

			& > svg {
				width: ${p.size}px;
				height: ${p.size}px;
			}
		`}
`;

const getColor = (colorAlias: string, theme: Theme) => {
	const colorMap = {
		accent: theme.palette.accent,
		text: theme.palette.text,
	};

	return colorMap[colorAlias];
};

export { IconBase };
