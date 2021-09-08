import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import '@styles/index.css';
import { ErrorBoundary } from '@ui/error-boundary';
import { routes } from '@routing';

export type AppProps = {};

const App: React.FC<AppProps> = () => {
	return (
		<>
			<Switch>
				<Route
					path={routes.root}
					render={() => (
						<ErrorBoundary>
							<div>root</div>
						</ErrorBoundary>
					)}
				/>
				<Redirect to={routes.root} />
			</Switch>
		</>
	);
};

export { App };
