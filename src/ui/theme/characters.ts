import { ThemesByBrandsMap, ThemeBrand, ThemeIdentifier } from './models';
import { pxToRem, createBoxShadow, lighten } from '@utils/styles';

const themesMap: ThemesByBrandsMap = {
	[ThemeBrand.DEFAULT]: {
		fontFamily: 'Roboto, sans-serif',
		fontSize: '14px',
		lineHeight: '1.2',
		palette: {
			accent: '#86005B',
			warning: '#ffc107',
			alarm: '#AC0014',
			text: '#fff',
			hint: '#55084C',
			stealth: '#4A4453',
			space: '#0C0513',
		},
		button: {
			contained: {
				accent: {
					textColor: '#fff',
					backgroundColor: '#26d06d',
					backgroundColorHover: '#00c853',
					backgroundColorFocus: '#00c853',
					textColorDisabled: '#fff',
					backgroundColorDisabled: '#bfbfbf',
				},
				light: {
					textColor: '#262626',
					backgroundColor: '#fff',
					backgroundColorHover: '#ebebeb',
					backgroundColorFocus: '#00c853',
					textColorDisabled: '#fff',
					backgroundColorDisabled: '#bfbfbf',
				},
			},
		},
		link: {
			textColor: '#26d06d',
			textColorHover: '#2196f3',
			textColorFocus: '#2196f3',
		},
		alert: {
			warning: {
				textColor: '#262626',
				backgroundColor: lighten('#ffc107', 0.8),
				borderColor: lighten('#ffc107', 0.6),
			},
			alarm: {
				textColor: '#262626',
				backgroundColor: lighten('#ff3a48', 0.8),
				borderColor: lighten('#ff3a48', 0.6),
			},
			success: {
				textColor: '#262626',
				backgroundColor: lighten('#26d06d', 0.8),
				borderColor: lighten('#26d06d', 0.6),
			},
		},
		card: {
			backgroundColor: '#120822',
		},
		chart: {
			candlestick: {
				backgroundColor: '#120822',
			},
		},
		fn: {
			pxToRem,
			createBoxShadow,
		},
	},
};

function createTheme(value: ThemeIdentifier) {
	const [themeBrand] = value;
	const theme = themesMap[themeBrand];

	return theme;
}

const scope = {
	changer: (x: ThemeIdentifier) => {},
};

function setThemeChanger(changer: (value: ThemeIdentifier) => void) {
	scope.changer = changer;
}

function changeTheme(value: ThemeIdentifier) {
	scope.changer(value);
}

export { themesMap, createTheme, setThemeChanger, changeTheme };
