import React from 'react';

import { Box } from '@ui/box';
import { IconButton } from '@ui/icon-button';
import { ArrowLeftIcon } from '@ui/icon/arrow-left';
import { Root, Header, ContentLayout, DocumentContent, FloatingPanelRoot } from './styled';

export type NavigationShellProps = {
	onRequestGoBack: () => void;
};

const NavigationShell: React.FC<NavigationShellProps> = props => {
	const { children, onRequestGoBack } = props;

	return (
		<Root>
			<Header>
				<Box width={40}>
					<IconButton title='Назад' appearance='rounded' onClick={onRequestGoBack}>
						<ArrowLeftIcon color='black' size={24} />
					</IconButton>
				</Box>
			</Header>
			<ContentLayout>{children}</ContentLayout>
		</Root>
	);
};

export type FloatingPanelProps = {};

const FloatingPanel: React.FC<FloatingPanelProps> = props => {
	const { children } = props;

	return <FloatingPanelRoot>{children}</FloatingPanelRoot>;
};

export { NavigationShell, DocumentContent, FloatingPanel };
