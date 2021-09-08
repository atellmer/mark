import React from 'react';

import { Root } from './styled';

export type AlertProps = {
	appearance?: 'warning' | 'danger' | 'success';
	fullWidth?: boolean;
};

const Alert: React.FC<AlertProps> = props => {
	return <Root {...props} />;
};

Alert.defaultProps = {
	appearance: 'warning',
};

export { Alert };
