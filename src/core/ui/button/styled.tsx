import styled, { css } from 'styled-components';

import { ButtonAppearance, ButtonColor, ButtonSize } from './models';
import { ButtonProps } from './button';

const createStyles = (props: ButtonProps) => {
	const sizeMap: Record<ButtonSize, () => any> = {
		small: () => css`
			text-transform: none;
			font-weight: 400;
			font-size: 14px;
			height: 26px;

			& .btn-content {
				padding: 4px 6px;
			}
		`,
		medium: () => css`
			height: 35px;
		`,
		large: () => css`
			font-size: 14px;
			height: 50px;

			& .btn-content {
				padding: 8px 20px;
			}
		`,
	};

	const size = () => sizeMap[props.size]();

	const appearanceMap: Record<ButtonAppearance, () => any> = {
		contained: () => {
			const colorMap: Record<ButtonColor, () => any> = {
				accent: () => css`
					color: ${props.theme.button.contained.accent.textColor};
					background-color: ${props.theme.button.contained.accent.backgroundColor};

					&:hover {
						background-color: ${props.theme.button.contained.accent.backgroundColorHover};
					}

					&[disabled] {
						background-color: ${props.theme.button.contained.accent.backgroundColorDisabled};
						color: ${props.theme.button.contained.accent.textColorDisabled};
					}

					&[disabled] i {
						color: ${props.theme.button.contained.accent.textColorDisabled};
					}
				`,
				light: () => css`
					color: ${props.theme.button.contained.light.textColor};
					background-color: ${props.theme.button.contained.light.backgroundColor};

					&:hover {
						background-color: ${props.theme.button.contained.light.backgroundColorHover};
					}

					&[disabled] {
						background-color: ${props.theme.button.contained.light.backgroundColorDisabled};
						color: ${props.theme.button.contained.light.textColorDisabled};
					}

					&[disabled] i {
						color: ${props.theme.button.contained.light.textColorDisabled};
					}
				`,
				dark: () => css``,
			};

			return css`
				${colorMap[props.color]()}
				${size()}
			`;
		},
	};

	return appearanceMap[props.appearance]();
};

const ButtonStyled = styled.button<ButtonProps>`
	position: relative;
	z-index: 1;
	display: inline-block;
	max-width: 100%;
	border-radius: 2px;
	font-size: 13px;
	text-transform: uppercase;
	font-weight: 500;
	background-color: transparent;
	transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	user-select: none;
	cursor: pointer;
	border: 0;
	padding: 0;
	overflow: hidden;

	${p => css`
		${p.theme.fn.createBoxShadow(1)}

		&:active,
		&:focus {
			box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%),
				0px 3px 14px 2px rgb(0 0 0 / 12%);
		}
	`}

	&[disabled],
	&[disabled] * {
		pointer-events: none;
	}

	${p =>
		p.fullWidth &&
		css`
			width: 100%;
		`}

	& > div {
		width: 100%;
	}

	${p => createStyles(p)}
`;

type ButtonContentProps = {
	size: 'small' | 'medium' | 'large';
};

const ButtonContent = styled.span.attrs(() => ({
	className: 'btn-content',
}))`
	position: relative;
	width: 100%;
	padding: 8px 16px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	white-space: nowrap;
	line-height: initial; // important for vertical align text

	& i ~ *,
	& * ~ i {
		margin-left: 10px;
	}

	${(p: ButtonContentProps) =>
		p.size === 'small' &&
		css`
			& i ~ *,
			& * ~ i {
				margin-left: 4px;
			}
		`}
`;

export { ButtonStyled, ButtonContent };
