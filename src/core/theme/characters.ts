import { ThemesByBrandsMap, ThemeBrand, ThemeIdentifier } from './models';
import { pxToRem, createBoxShadow, lighten } from '@utils/styles';

const themesMap: ThemesByBrandsMap = {
	[ThemeBrand.DEFAULT]: {
		fontFamily: 'Roboto, sans-serif',
		fontSize: '14px',
		lineHeight: '1.2',
		palette: {
			accent: '#26d06d',
			warning: '#ffc107',
			alarm: '#ff3a48',
			text: '#262626',
			textContrast: '#fff',
			label: '#8c8c8c',
			hint: '#bfbfbf',
			stealth: '#ebebeb',
			background: '#E8EAF6',
			space: '#fff',
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
