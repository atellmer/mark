/// <reference path="./d.ts-reference/index.d.ts" />
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { logBuildInfo } from '@utils/env';
import {
	ThemeProvider as AppThemeProvider,
	createTheme,
	GlobalStyle,
	defaultThemeIdentifier,
	setThemeChanger,
} from '@theme';
import { App } from './app';

logBuildInfo();

if (process.env.NODE_ENV === 'production') {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register(`${location.origin}/shared-documents/sw.js`)
				.then(reg => console.log(`SW registered: `, reg))
				.catch(err => console.error('SW: ', err));
		});
	}
}

const Shell: React.FC = () => {
	const [themeIdentifier, setThemeIndentifier] = useState(defaultThemeIdentifier);
	const styledTheme = {
		...createTheme(themeIdentifier),
	};

	useEffect(() => {
		setThemeChanger(setThemeIndentifier);
	}, []);

	return (
		<AppThemeProvider themeIdentifier={themeIdentifier}>
			<StyledThemeProvider theme={styledTheme}>
				<GlobalStyle />
				<App />
			</StyledThemeProvider>
		</AppThemeProvider>
	);
};

ReactDOM.render(
	<Router>
		<Shell />
	</Router>,
	document.getElementById('app'),
);
