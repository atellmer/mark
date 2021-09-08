import styled, { css } from 'styled-components';

import { Theme } from '@theme';
import type { AlertProps } from './alert';

const Root = styled.div<AlertProps>`
	position: relative;
	padding: 16px;
	border: 1px solid transparent;
	border-radius: 2px;
	font-size: inherit;
	line-height: 1.4;

	${p => getColor(p.appearance, p.theme)}

	${p =>
		p.fullWidth &&
		css`
			width: 100%;
		`}
`;

const getColor = (appearance: AlertProps['appearance'], theme: Theme) => {
	const map = {
		warning: () => css`
			color: ${theme.alert.warning.textColor};
			background-color: ${theme.alert.warning.backgroundColor};
			border-color: ${theme.alert.warning.borderColor};
		`,
		danger: () => css`
			color: ${theme.alert.alarm.textColor};
			background-color: ${theme.alert.alarm.backgroundColor};
			border-color: ${theme.alert.alarm.borderColor};
		`,
		success: () => css`
			color: ${theme.alert.success.textColor};
			background-color: ${theme.alert.success.backgroundColor};
			border-color: ${theme.alert.success.borderColor};
		`,
	};

	return map[appearance]();
};

export { Root };
