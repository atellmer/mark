import React from 'react';

import { Root, InputLayout, Input, Adornment, HelperText, LabelText } from './styled';

export type TextFieldProps = {
	value: string;
	name?: string;
	labelText?: string;
	placeholder?: string;
	adornment?: React.ReactNode;
	fullWidth: boolean;
	autoFocus?: boolean;
	error?: boolean | string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const TextField: React.FC<TextFieldProps> = props => {
	const {
		value,
		type,
		name,
		labelText,
		placeholder,
		adornment,
		fullWidth,
		autoFocus,
		error,
		disabled,
		onChange,
		...rest
	} = props;
	const hasAdornment = Boolean(adornment);
	const hasError = Boolean(error);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		onChange(e, value);
	};

	return (
		<Root hasAdornment={hasAdornment} fullWidth={fullWidth} hasError={hasError} disabled={disabled}>
			<label>
				<LabelText>{labelText}</LabelText>
				<InputLayout>
					<Input
						{...rest}
						value={value}
						type={type}
						name={name}
						autoFocus={autoFocus}
						disabled={disabled}
						placeholder={placeholder}
						onChange={handleChange}
					/>
					{hasAdornment && <Adornment>{adornment}</Adornment>}
				</InputLayout>
			</label>
			{typeof error === 'string' && <HelperText>{error}</HelperText>}
		</Root>
	);
};

export { TextField };
