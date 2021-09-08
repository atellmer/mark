import { createGlobalStyle, css } from 'styled-components';

import { detectIsFunction } from '@utils/helpers';
import { darken } from '@utils/styles';

const GlobalStyle = createGlobalStyle`
	${p => css`
		* {
			font-family: ${p.theme.fontFamily};
		}

		html {
			font-size: ${p.theme.fontSize};
			line-height: ${p.theme.lineHeight};
		}

		body {
			background-color: ${p.theme.palette.space};
			color: ${p.theme.palette.text};
		}

		button {
			color: ${p.theme.palette.text};
		}

		::-webkit-scrollbar-thumb {
			background-color: ${darken(p.theme.palette.hint, 0.1)};
		}

		::-webkit-scrollbar-thumb:hover {
			background-color: ${darken(p.theme.palette.hint, 0.3)};
		}

		::-webkit-scrollbar-track {
			background-color: ${darken(p.theme.palette.space, 0.05)};
		}
	`}

	${p => (detectIsFunction(p.theme.fn.onCreateGlobalStyle) && p.theme.fn.onCreateGlobalStyle() ? `` : ``)}
`;

export { GlobalStyle };
