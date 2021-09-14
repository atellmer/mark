import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import '@ui/styles/index.css';
import { routes } from '@ui/routing';
import TradingTesterEntry from '@ui/modules/trading-tester/components/entry';

export type AppProps = {};

const App: React.FC<AppProps> = () => {
	return (
		<>
			<Switch>
				<Route path={routes.tester} component={TradingTesterEntry} />
				<Redirect to={routes.tester} />
			</Switch>
		</>
	);
};

export { App };
