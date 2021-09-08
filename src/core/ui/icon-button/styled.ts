import styled, { css } from 'styled-components';

import { IconButtonProps } from './icon-button';

type RootProps = {} & Pick<IconButtonProps, 'appearance' | 'shadowed'>;

const Root = styled.button<RootProps>`
	position: relative;
	background-color: transparent;
	border: none;
	cursor: pointer;
	border-radius: 2px;
	user-select: none;
	transition: background-color 200ms ease-in-out;
	overflow: hidden;
	padding: 0;

	${p =>
		p.shadowed &&
		css`
			${p.theme.fn.createBoxShadow(1)}
			background-color: ${p.theme.button.contained.light.backgroundColor};
		`}

	${p =>
		p.appearance === 'rounded' &&
		css`
			border-radius: 50%;
		`}

	${p => css`
		color: ${p.theme.button.contained.light.textColor};

		&:hover {
			background-color: ${p.theme.button.contained.light.backgroundColorHover};
		}

		&[disabled] {
			background-color: ${p.theme.button.contained.light.backgroundColorDisabled};
			color: ${p.theme.button.contained.light.textColorDisabled};
			cursor: default;
		}

		&[disabled] i {
			color: ${p.theme.button.contained.light.textColorDisabled};
		}
	`}
`;

const ContentLayout = styled.span`
	position: relative;
	min-width: 32px;
	min-height: 32px;
	padding: 8px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
`;

export { Root, ContentLayout };
