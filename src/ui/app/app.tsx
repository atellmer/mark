import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import '@ui/styles/index.css';
import { routes } from '@ui/routing';
import TradingTesterEntry from '@ui/modules/trading-tester/components/entry';
import DashboardEntry from '@ui/modules/dashboard/components/entry';

export type AppProps = {};

const App: React.FC<AppProps> = () => {
	return (
		<>
			<Switch>
				<Route path={routes.dashboard} component={DashboardEntry} />
				<Route path={routes.tester} component={TradingTesterEntry} />
				<Redirect to={routes.dashboard} />
			</Switch>
		</>
	);
};

export { App };
