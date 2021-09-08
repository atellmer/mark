/// <reference path="../ref/index.d.ts" />
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import {
	ThemeProvider as AppThemeProvider,
	createTheme,
	GlobalStyle,
	defaultThemeIdentifier,
	setThemeChanger,
} from '@ui/theme';
import { App } from './app';

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
