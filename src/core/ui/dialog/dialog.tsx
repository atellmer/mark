import React, { useState } from 'react';
import { useSpring } from 'react-spring';

import { Box } from '@ui/box';
import { IconButton } from '@ui/icon-button';
import { CloseIcon } from '@ui/icon/close';
import { Overlay } from '@ui/overlay';
import { Portal } from '@ui/portal';
import { Root, WindowLayout, Window, Header, Content, Footer } from './styled';

export type DialogProps = {
	isOpen: boolean;
};

const DialogContainer: React.FC<DialogProps> = props => {
	const { isOpen, children } = props;
	const [isCloseAnimationDone, setIsCloseAnimationDone] = useState(true);
	const style = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'translate3D(0, 0, 0)' : 'translate3D(0, -100px, 0)',
		onStart: () => {
			isOpen && setIsCloseAnimationDone(false);
		},
		onRest: () => {
			!isOpen && setIsCloseAnimationDone(true);
		},
	});

	return (
		<>
			<Overlay isOpen={isOpen} />
			{!isOpen && isCloseAnimationDone ? null : (
				<Portal>
					<Root>
						<WindowLayout>
							<Window style={style}>{children}</Window>
						</WindowLayout>
					</Root>
				</Portal>
			)}
		</>
	);
};

export type DialogHeaderProps = {
	onRequestClose: () => void;
};

const DialogHeader: React.FC<DialogHeaderProps> = props => {
	const { children, onRequestClose } = props;

	return (
		<Header>
			<Box flex='1 1 auto' padding='12px 48px 12px 16px'>
				{children}
			</Box>
			<Box position='absolute' top={4} right={4}>
				<IconButton appearance='rounded' onClick={onRequestClose}>
					<CloseIcon size={24} />
				</IconButton>
			</Box>
		</Header>
	);
};

export type DialogContentProps = {
	maxWidth?: number;
};

const DialogContent: React.FC<DialogContentProps> = props => {
	const { maxWidth, children } = props;

	return <Content maxWidth={maxWidth}>{children}</Content>;
};

export type DialogFooterProps = {};

const DialogFooter: React.FC<DialogFooterProps> = props => {
	const { children } = props;

	return <Footer>{children}</Footer>;
};

const Dialog = {
	Container: DialogContainer,
	Header: DialogHeader,
	Content: DialogContent,
	Footer: DialogFooter,
};

export { Dialog };
