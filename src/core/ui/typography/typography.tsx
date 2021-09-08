import React from 'react';
import styled, { css } from 'styled-components';

import { pxToRem } from '@utils/styles';
import { Box, BoxProps } from '@ui/box';
import { WithThemeProps } from '@theme';

export type TextProps = {
	ellipsis?: boolean;
} & BoxProps &
	WithThemeProps;

const Text = styled(({ fontSize, color, ...rest }: TextProps) => (
	<Box
		component='span'
		fontSize={fontSize ? pxToRem(fontSize) : 'inherit'}
		color={color || 'inherit'}
		fontStyle='normal'
		{...rest}
	/>
))`
	${p =>
		p.ellipsis &&
		css`
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		`}
`;

type HeadlineProps = {} & TextProps;

const Headline = styled((props: HeadlineProps) => (
	<Text component='h1' fontSize={24} fontWeight={400} lineHeight={1.33} textAlign='left' margin='0' {...props} />
))``;

type TitleProps = {} & TextProps;

const Title = styled((props: TitleProps) => (
	<Text component='h1' fontSize={20} fontWeight={500} lineHeight={1.2} textAlign='left' margin='0' {...props} />
))``;

type SubheadingProps = {} & TextProps;

const Subheading = styled((props: SubheadingProps) => (
	<Text component='h2' fontSize={16} fontWeight={400} lineHeight={1.25} textAlign='left' margin='0' {...props} />
))``;

type BodyProps = {} & TextProps;

const Body = styled((props: BodyProps) => (
	<Text component='span' fontWeight={400} lineHeight={1.43} textAlign='left' {...props} />
))``;

type CaptionProps = {} & TextProps;

const Caption = styled((props: CaptionProps) => (
	<Text component='span' fontSize={12} fontWeight={400} lineHeight={1.25} textAlign='left' {...props} />
))``;

type DisplayProps = {
	appearance?: 1 | 2 | 3 | 4;
} & TextProps;

const displayComponentMap = {
	1: 'h1',
	2: 'h2',
	3: 'h3',
	4: 'h4',
};

const displayAppearanceMap = {
	1: `
		font-size: ${pxToRem(112)};
		line-height: 1.07;
	`,
	2: `
		font-size: ${pxToRem(56)};
		line-height: 1.21;
	`,
	3: `
		font-size: ${pxToRem(45)};
		line-height: 1.24;
	`,
	4: `
		font-size: ${pxToRem(34)};
		line-height: 1.65;
	`,
};

const Display = styled(({ appearance, ...rest }: DisplayProps) => (
	<Text
		component={(displayComponentMap[appearance] as any) || 'h1'}
		fontWeight={300}
		textAlign='left'
		margin='0'
		{...rest}
	/>
))`
	${displayAppearanceMap['1']};

	${p =>
		p.appearance &&
		`
		${displayAppearanceMap[p.appearance]}
	`}
`;

type LabelProps = {
	appearance?: 'normal' | 'danger' | 'accent';
} & TextProps;

const Label = styled(({ ...rest }: LabelProps) => (
	<Text component='label' fontWeight={400} lineHeight={1.25} textAlign='left' {...rest} />
))`
	${(p: LabelProps) => css`
		color: ${p.theme.palette.hint};
	`}

	${(p: LabelProps) =>
		p.appearance === 'danger' &&
		css`
			color: ${p.theme.palette.alarm};
		`}

	${(p: LabelProps) =>
		p.appearance === 'accent' &&
		css`
			color: ${p.theme.palette.accent};
		`}
`;

type NbspProps = { times?: number };

const Nbsp: React.FC<NbspProps> = ({ times }) => <span>{Array(times).fill('\u00A0')}</span>;

Nbsp.displayName = 'Nbsp';
Nbsp.defaultProps = { times: 1 };

const Typography = {
	Text,
	Headline,
	Title,
	Subheading,
	Body,
	Caption,
	Display,
	Label,
	Nbsp,
};

export { Typography };
