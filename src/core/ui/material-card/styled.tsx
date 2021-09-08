import React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@ui/box';
import { WithThemeProps } from '@theme';
import { MaterialCardProps } from './material-card';

type RootProps = {} & MaterialCardProps & WithThemeProps;

const Root = styled(({ elevation, hoverElevation, appearance, fullWidth, ...rest }) => <Box {...rest} />)`
	position: relative;
	transition: box-shadow 0.2s ease-in-out;
	${(p: RootProps) =>
		p.fullWidth &&
		css`
			width: 100%;
		`}
	${p => p.theme.fn.createBoxShadow(p.elevation)}

	${(p: RootProps) => css`
		background-color: ${p.theme.palette.space};
	`}

	&:hover {
		${p => p.theme.fn.createBoxShadow(p.hoverElevation)}
		z-index: 1;
	}
` as React.FunctionComponent<RootProps>;

export { Root };
