import React, { useRef } from 'react';

import { fade } from '@utils/styles';
import { CheckboxCheckedIcon } from '@ui/icon/checkbox-checked';
import { CheckboxUncheckedIcon } from '@ui/icon/checkbox-unchecked';
import { useTheme } from '@theme';
import { Root, InputLayout, Input, Outline, IconLayout } from './styled';

export type CheckboxProps = {
	value: boolean;
	label: React.ReactNode;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<CheckboxProps> = props => {
	const { value: checked, disabled, label, onChange } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const { theme } = useTheme();
	const rippleColor = checked ? fade(theme.palette.accent, 0.25) : 'rgba(0, 0, 0, 0.1)';

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		const nativeEvent = e.nativeEvent as any as { clientX: number; clientY: number };
		const fromKeyboard = nativeEvent.clientX === 0 && nativeEvent.clientY === 0;

		fromKeyboard ? inputRef.current?.focus() : inputRef.current?.blur();
	};

	return (
		<Root isDisabled={disabled}>
			<InputLayout appearance='centric' component='span' during={1000} color={rippleColor}>
				<span>
					<Input ref={inputRef} checked={checked} disabled={disabled} onChange={handleChange} />
					<Outline />
					<IconLayout key={checked ? 1 : 2}>
						{checked ? (
							<CheckboxCheckedIcon color={disabled ? 'muted' : 'accent'} size={24} />
						) : (
							<CheckboxUncheckedIcon color={disabled ? 'muted' : 'black'} size={24} />
						)}
					</IconLayout>
				</span>
			</InputLayout>
			{label}
		</Root>
	);
};

export { Checkbox };
