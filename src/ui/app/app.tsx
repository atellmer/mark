import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import '@ui/styles/index.css';
import { routes } from '@ui/routing';
import '@ui/modules/root';

export type AppProps = {};

const App: React.FC<AppProps> = () => {
	return (
		<>
			<Switch>
				<Route path={routes.root} render={() => <div>root</div>} />
				<Redirect to={routes.root} />
			</Switch>
		</>
	);
};

export { App };
