import React, { useState, useMemo } from 'react';

import { useMounted } from '@hooks/use-mounted';
import { Root, Animated } from './styled';

export type RippleProps = {
	appearance?: 'centric';
	during?: number;
	color?: string;
	className?: string;
	skip?: boolean;
	style?: React.CSSProperties;
	fullWidth?: boolean;
	fullHeight?: boolean;
	component?: string | React.ComponentType<any>;
};

const Ripple: React.FC<RippleProps> = props => {
	const {
		appearance,
		during,
		color: sourceColor,
		skip,
		style,
		fullWidth,
		fullHeight,
		component,
		children,
		...rest
	} = props;
	const [{ top, left, size, inProgress }, setState] = useState({
		top: 0,
		left: 0,
		size: 0,
		inProgress: false,
	});
	const { mounted } = useMounted();
	const mergedStyle = useMemo(
		() => ({
			...boxStyle,
			...style,
			...{ width: fullWidth ? '100%' : 'inherit', height: fullHeight ? '100%' : 'inherit' },
		}),
		[style],
	);
	const color = sourceColor || 'rgba(0, 0, 0, 0.4)';

	const deactivate = () =>
		setState({
			top: 0,
			left: 0,
			size: 0,
			inProgress: false,
		});

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const { pageX, pageY, currentTarget } = e;
		const isCentric = appearance === 'centric';
		const rect = currentTarget.getBoundingClientRect();
		const left = isCentric ? rect.width / 2 : pageX - (rect.left + window.scrollX);
		const top = isCentric ? rect.height / 2 : pageY - (rect.top + window.scrollY);
		const size = Math.max(rect.width, rect.height);

		const activate = () =>
			!skip &&
			setState({
				top,
				left,
				size,
				inProgress: true,
			});

		if (inProgress) {
			deactivate();
			requestAnimationFrame(() => {
				mounted() && activate();
			});
		} else {
			activate();
		}
	};

	const handleAnimationEnd = () => deactivate();

	return (
		<Root as={component} {...rest} style={mergedStyle} onClick={handleClick}>
			{children}
			<Animated
				inProgress={inProgress}
				during={during}
				color={color}
				top={top}
				left={left}
				size={size}
				onAnimationEnd={handleAnimationEnd}
			/>
		</Root>
	);
};

Ripple.defaultProps = {
	during: 800,
	className: '',
	style: {},
	component: 'div',
};

const boxStyle: React.CSSProperties = {
	position: 'relative',
	display: 'inline-flex',
	overflow: 'hidden',
};

export { Ripple };
