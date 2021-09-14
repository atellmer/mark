import React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@ui/kit/box';
import { WithThemeProps } from '@ui/theme';
import { CardProps } from './card';

type RootProps = {} & CardProps & WithThemeProps;

const Root = styled(({ elevation, hoverElevation, fullWidth, ...rest }) => <Box {...rest} />)`
	position: relative;
	transition: box-shadow 0.2s ease-in-out;
	${(p: RootProps) =>
		p.fullWidth &&
		css`
			width: 100%;
		`}
	${p => p.theme.fn.createBoxShadow(p.elevation)}

	${(p: RootProps) => css`
		background-color: ${p.theme.card.backgroundColor};
	`}

	&:hover {
		${p => p.theme.fn.createBoxShadow(p.hoverElevation)}
		z-index: 1;
	}
` as React.FunctionComponent<RootProps>;

export { Root };
