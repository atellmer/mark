import React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@ui/box';
import { WithThemeProps } from '@theme';
import { LinkProps } from './link';

type RootProps = {} & LinkProps & WithThemeProps;

const Root = styled(({ appearance, underline, ...rest }) => <Box {...rest} />)`
	background-color: transparent;
	cursor: pointer;
	text-decoration: none;
	transition: color 0.2s ease-in-out;

	${(p: RootProps) => css`
		color: ${p.theme.link.textColor};

		&:focus {
			color: ${p.theme.link.textColorFocus};
		}

		&:hover {
			color: ${p.theme.link.textColorHover};
			text-decoration: underline;
			border-color: ${p.theme.link.textColorHover};
		}
	`}
`;

export { Root };
