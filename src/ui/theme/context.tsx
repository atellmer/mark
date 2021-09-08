import React, { createContext, useContext, forwardRef } from 'react';

import { ThemeBrand, ThemeIdentifier } from './models';
import { createTheme } from './characters';

const defaultThemeIdentifier: ThemeIdentifier = [ThemeBrand.DEFAULT];
const ThemeContext = createContext<ThemeIdentifier>(defaultThemeIdentifier);

function useTheme() {
	const value = useContext(ThemeContext);
	const theme = createTheme(value);
	const [themeBrand] = value;

	return {
		themeBrand,
		theme,
	};
}

type ThemeProviderProps = {
	themeIdentifier: ThemeIdentifier;
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ themeIdentifier, children }) => {
	return <ThemeContext.Provider value={themeIdentifier}>{children}</ThemeContext.Provider>;
};

type ThemeConsumerProps = {
	children: (value: ThemeIdentifier) => React.ReactNode;
};

const ThemeConsumer: React.FC<ThemeConsumerProps> = ({ children }) => {
	return <ThemeContext.Consumer>{value => children(value)}</ThemeContext.Consumer>;
};

function withTheme<P>(WrappedComponent: React.ComponentType<P>) {
	const Component = forwardRef<unknown, P>((props, ref) => {
		const { theme } = useTheme();

		return <WrappedComponent ref={ref} {...props} theme={theme} />;
	});

	return Component;
}

export { defaultThemeIdentifier, useTheme, ThemeProvider, ThemeConsumer, withTheme };
