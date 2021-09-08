import styled, { css } from 'styled-components';

type RootProps = {
	hasAdornment: boolean;
	hasError: boolean;
	fullWidth: boolean;
	disabled: boolean;
};

const Root = styled.div<RootProps>`
	position: relative;
	vertical-align: top;
	display: inline-block;

	${p =>
		p.fullWidth &&
		css`
			width: 100%;
		`}

	${p =>
		p.hasAdornment &&
		css`
			& input {
				border-radius: 8px 0 0 8px;
				border-right: 0;
			}
		`}

	${p =>
		p.hasError &&
		css`
			& input,
			& [data-adornment] {
				border-color: ${p.theme.palette.alarm};
			}
		`}

	${p =>
		p.disabled &&
		css`
			& [data-adornment] {
				border-color: ${p.theme.palette.label};
			}

			& [data-adornment] svg {
				filter: grayscale(1);
			}
		`}
`;

const InputLayout = styled.span`
	display: inline-flex;
	width: 100%;
	align-items: flex-end;
`;

const Input = styled.input`
	width: 100%;
	padding: 8px 16px;
	font-family: inherit;
	line-height: inherit;
	border-radius: 8px;
	height: 42px;
	outline: none;
	border: 2px solid transparent;
	transition: border-color 0.2s ease-in-out;

	${p => css`
		font-size: ${p.theme.fn.pxToRem(16)};
		background-color: rgb(245, 248, 250);
		border-color: ${p.theme.palette.stealth};

		&:focus {
			border-color: ${p.theme.palette.accent};
		}

		&:focus ~ div {
			border-color: ${p.theme.palette.accent};
		}

		&[disabled] {
			background-color: ${p.theme.palette.stealth};
			border-color: ${p.theme.palette.stealth};
		}
	`}
`;

const HelperText = styled.p`
	width: 100%;
	margin: 2px 0;

	${p => css`
		color: ${p.theme.palette.alarm};
		font-size: ${p.theme.fn.pxToRem(13)};
	`}
`;

const LabelText = styled.span`
	display: inline-block;
	margin-bottom: 4px;

	${p => css`
		font-size: ${p.theme.fn.pxToRem(12)};
		color: ${p.theme.palette.label};
	`}
`;

const Adornment = styled.div.attrs({
	'data-adornment': 'true',
})`
	width: 46px;
	height: 42px;
	border-radius: 0 8px 8px 0;
	border: 2px solid transparent;
	transition: border-color 0.2s ease-in-out;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	${p => css`
		background-color: rgb(245, 248, 250);
		border-color: ${p.theme.palette.stealth};
	`}
`;

export { Root, InputLayout, Input, HelperText, LabelText, Adornment };
