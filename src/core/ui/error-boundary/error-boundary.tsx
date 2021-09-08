import React from 'react';

export type ErrorBoundaryProps = {
	children: React.ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError(error) {
		return { hasError: Boolean(error) };
	}

	componentDidCatch(error) {
		const errorText = error.stack.toString();
	}

	render() {
		if (this.state.hasError) return null;

		return this.props.children;
	}
}

export { ErrorBoundary };
