import React, { forwardRef } from 'react';

import { Ripple } from '@ui/ripple';
import { Root, ContentLayout } from './styled';

export type IconButtonProps = {
	appearance?: 'rounded';
	shadowed?: boolean;
	children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLButtonElement>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
	const { appearance, shadowed, disabled, children, onClick, ...rest } = props;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTimeout(() => onClick(e), 100);
	};

	return (
		<Root
			ref={ref}
			appearance={appearance}
			shadowed={shadowed}
			disabled={disabled}
			onClick={handleClick}
			{...(rest as any)}>
			<Ripple skip={disabled}>
				<ContentLayout>{children}</ContentLayout>
			</Ripple>
		</Root>
	);
});

export { IconButton };
