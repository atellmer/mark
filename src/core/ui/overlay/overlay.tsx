import React, { useState, useEffect, useMemo } from 'react';
import { useSpring } from 'react-spring';

import { blockScroll, lackOfTwitching } from '@utils/dom';
import { Portal } from '@ui/portal';
import { Root } from './styled';

export type OverlayProps = {
	isOpen: boolean;
};

const Overlay: React.FC<OverlayProps> = props => {
	const { isOpen } = props;
	const [isCloseAnimationDone, setIsCloseAnimationDone] = useState(true);
	const scope = useMemo(() => ({ dispose: () => {} }), []);
	const style = useSpring({
		opacity: isOpen ? 1 : 0,
		onStart: () => {
			isOpen && setIsCloseAnimationDone(false);
		},
		onRest: () => {
			if (!isOpen) {
				setIsCloseAnimationDone(true);
				scope.dispose();
			}
		},
	});

	useEffect(() => {
		if (!isOpen) return;
		const [removeLack, restoreLack] = lackOfTwitching();
		removeLack();
		const unblock = blockScroll();

		scope.dispose = () => {
			restoreLack();
			unblock();
		};
	}, [isOpen]);

	if (!isOpen && isCloseAnimationDone) return null;

	return (
		<Portal>
			<Root style={style} />
		</Portal>
	);
};

export { Overlay };
