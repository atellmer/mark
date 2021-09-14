export enum ThemeBrand {
	DEFAULT = 'default',
}

export type ThemeIdentifier = [ThemeBrand];

export type Theme = {
	fontFamily: string;
	fontSize: string;
	lineHeight: string;
	palette: {
		accent: string;
		warning: string;
		alarm: string;
		text: string;
		hint: string;
		stealth: string;
		space: string;
	};
	button: {
		contained: {
			accent: ButtonTheme;
			light: ButtonTheme;
		};
	};
	link: LinkTheme;
	alert: {
		warning: AlertTheme;
		alarm: AlertTheme;
		success: AlertTheme;
	};
	card: CardTheme;
	chart: {
		candlestick: CandlestickChartTheme;
	};
	fn: {
		createBoxShadow: (elevation: ShadowElevation) => string;
		pxToRem: (value: number) => string;
		onCreateGlobalStyle?: () => Promise<boolean>;
	};
};

export type ThemesByBrandsMap = Record<ThemeBrand, Theme>;

export type WithThemeProps = { theme?: Theme };

export type ShadowElevation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type ButtonTheme = {
	textColor: string;
	backgroundColor: string;
	backgroundColorHover: string;
	backgroundColorFocus: string;
	textColorDisabled: string;
	backgroundColorDisabled: string;
};

type LinkTheme = {
	textColor: string;
	textColorHover: string;
	textColorFocus: string;
};

type AlertTheme = {
	textColor: string;
	backgroundColor: string;
	borderColor: string;
};

type CardTheme = {
	backgroundColor: string;
};

type CandlestickChartTheme = {
	backgroundColor: string;
};
