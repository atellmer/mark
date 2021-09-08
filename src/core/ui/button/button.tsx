import React, { useRef } from 'react';

import { Ripple, RippleProps } from '@ui/ripple';
import { useTheme, WithThemeProps, Theme } from '@theme';
import { ButtonAppearance, ButtonColor, ButtonSize } from './models';
import { ButtonStyled, ButtonContent } from './styled';

export type ButtonProps = {
	appearance?: ButtonAppearance;
	color?: ButtonColor;
	size?: ButtonSize;
	fullWidth?: boolean;
	stopPropagation?: boolean;
	RippleProps?: Partial<RippleProps>;
	component?: any;
	onClick: React.MouseEventHandler<{}>;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	WithThemeProps;

const Button: React.FC<ButtonProps> = props => {
	const {
		appearance,
		color,
		size,
		RippleProps,
		stopPropagation,
		disabled,
		fullWidth,
		component,
		children,
		onClick,
		...rest
	} = props;
	const { theme } = useTheme();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		buttonRef.current.blur();
		e.persist();

		if (stopPropagation) {
			e.stopPropagation();
		}

		if (disabled) return;

		setTimeout(() => {
			typeof onClick === 'function' && onClick(e);
		});
	};

	const calculatedRippleColor = color === 'accent' ? 'textAccent' : color;
	const rippleProps = getRippleEffectProps(calculatedRippleColor, theme);

	return (
		<ButtonStyled
			{...rest}
			ref={buttonRef}
			tabIndex={0}
			as={component}
			appearance={appearance}
			color={color}
			size={size}
			disabled={disabled}
			fullWidth={fullWidth}
			onClick={handleClick}>
			<Ripple {...rippleProps} {...RippleProps} fullWidth fullHeight skip={disabled}>
				<ButtonContent size={size}>{children}</ButtonContent>
			</Ripple>
		</ButtonStyled>
	);
};

Button.defaultProps = {
	appearance: 'contained',
	color: 'light',
	size: 'medium',
	component: 'button',
	RippleProps: {},
};

const getRippleEffectProps = (key: string, theme: Theme) => {
	const props: Record<string, RippleProps> = {
		white: {},
		accent: {
			color: 'rgba(255, 255, 255, 0.7)',
		},
		textAccent: {
			color: theme.palette.accent,
		},
	};

	return props[key];
};

export { Button };
