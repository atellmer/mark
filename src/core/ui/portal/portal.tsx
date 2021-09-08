import React from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {};

class Portal extends React.Component<PortalProps> {
	portalElement: HTMLElement = document.createElement('div');

	componentDidMount() {
		document.body.appendChild(this.portalElement);
	}

	componentWillUnmount() {
		this.portalElement.parentNode.removeChild(this.portalElement);
		this.portalElement = null;
	}

	render() {
		return createPortal(this.props.children, this.portalElement);
	}
}

export { Portal };
