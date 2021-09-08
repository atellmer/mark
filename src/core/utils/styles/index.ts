import { ShadowElevation } from '@theme';

const BASE_FONT_SIZE = 14;

const getMeasureProp = (v: string | number, fallback?: any) =>
	typeof v === 'string' ? v : typeof v === 'number' ? `${v}px` : !v ? fallback || v : v;

const pxToRem = (size: number | string) => `${((parseFloat(`${size}`) / BASE_FONT_SIZE) * 1).toFixed(3)}rem`;

function mmToPx(value: number) {
	return Math.floor(value * 3.779527559055);
}

function createBoxShadow(elevation: ShadowElevation) {
	const map = {
		1: `box-shadow: 0 1px 4px rgba(0, 0, 0, 0.11), 0 1px 2px rgba(0, 0, 0, 0.11);`,
		2: `box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12);`,
		3: `box-shadow: 0 1px 8px rgba(0, 0, 0, 0.13), 0 1px 6px rgba(0, 0, 0, 0.13);`,
		4: `box-shadow: 0 1px 10px rgba(0, 0, 0, 0.14), 0 1px 8px rgba(0, 0, 0, 0.14);`,
		5: `box-shadow: 0 1px 12px rgba(0, 0, 0, 0.15), 0 1px 10px rgba(0, 0, 0, 0.15);`,
		6: `box-shadow: 0 1px 14px rgba(0, 0, 0, 0.16), 0 1px 12px rgba(0, 0, 0, 0.16);`,
		7: `box-shadow: 0 1px 16px rgba(0, 0, 0, 0.17), 0 1px 14px rgba(0, 0, 0, 0.17);`,
		8: `box-shadow: 0 1px 18px rgba(0, 0, 0, 0.18), 0 1px 16px rgba(0, 0, 0, 0.18);`,
		9: `box-shadow: 0 1px 20px rgba(0, 0, 0, 0.19), 0 1px 18px rgba(0, 0, 0, 0.19);`,
		10: `box-shadow: 0 1px 22px rgba(0, 0, 0, 0.20), 0 1px 20px rgba(0, 0, 0, 0.20);`,
	};

	return map[elevation] || '';
}

function clamp(value, min, max) {
	if (value < min) {
		return min;
	}
	if (value > max) {
		return max;
	}
	return value;
}

function convertColorToString(color) {
	const type = color.type;
	const values = color.values;

	if (type.indexOf('rgb') > -1) {
		for (let i = 0; i < 3; i++) {
			values[i] = parseInt(values[i]);
		}
	}

	let colorString = void 0;

	if (type.indexOf('hsl') > -1) {
		colorString = `${color.type}(${values[0]}, ${values[1]}%, ${values[2]}%`;
	} else {
		colorString = `${color.type}(${values[0]}, ${values[1]}, ${values[2]}`;
	}

	if (values.length === 4) {
		colorString += `, ${color.values[3]})`;
	} else {
		colorString += ')';
	}

	return colorString;
}

function convertHexToRGB(color) {
	if (color.length === 4) {
		let extendedColor = '#';
		for (let i = 1; i < color.length; i++) {
			extendedColor += `${color.charAt(i)}${color.charAt(i)}`;
		}
		color = extendedColor;
	}

	const values = {
		r: parseInt(color.substr(1, 2), 16),
		g: parseInt(color.substr(3, 2), 16),
		b: parseInt(color.substr(5, 2), 16),
	};

	return `rgb(${values.r}, ${values.g}, ${values.b})`;
}

function decomposeColor(color) {
	if (color.charAt(0) === '#') {
		return decomposeColor(convertHexToRGB(color));
	}

	const marker = color.indexOf('(');

	const type = color.substring(0, marker);
	let values = color.substring(Number(marker) + 1, color.length - 1).split(',');
	values = values.map(function (value) {
		return parseFloat(value);
	});

	return { type: type, values: values };
}

function fade(color, value) {
	color = decomposeColor(color);
	value = clamp(value, 0, 1);

	if (color.type === 'rgb' || color.type === 'hsl') {
		color.type += 'a';
	}
	color.values[3] = value;

	return convertColorToString(color);
}

function darken(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clamp(coefficient, 0, 1);

	if (color.type.indexOf('hsl') > -1) {
		color.values[2] *= 1 - coefficient;
	} else if (color.type.indexOf('rgb') > -1) {
		for (let i = 0; i < 3; i++) {
			color.values[i] *= 1 - coefficient;
		}
	}
	return convertColorToString(color);
}

function lighten(color, coefficient) {
	color = decomposeColor(color);
	coefficient = clamp(coefficient, 0, 1);

	if (color.type.indexOf('hsl') > -1) {
		color.values[2] += (100 - color.values[2]) * coefficient;
	} else if (color.type.indexOf('rgb') > -1) {
		for (let i = 0; i < 3; i++) {
			color.values[i] += (255 - color.values[i]) * coefficient;
		}
	}

	return convertColorToString(color);
}

export { getMeasureProp, pxToRem, mmToPx, createBoxShadow, darken, lighten, fade };
