import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

const Root = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1100;
	display: flex;
	overflow: auto;
`;

const WindowLayout = styled.div`
	padding: 16px;
	margin: auto;
	max-width: 100%;
	align-self: center; // for ie
`;

const Window = styled(animated.div)`
	min-height: 100px;
	max-width: 100%;
	display: flex;
	flex-flow: column nowrap;
	border-radius: 2px;

	${p => css`
		background-color: ${p.theme.palette.space};
		${p.theme.fn.createBoxShadow(5)}
	`}

	@media (min-width: 400px) {
		min-width: 400px;
	}
`;

const Header = styled.header`
	flex: 0 0 auto;
	min-height: 48px;
	display: flex;

	${p => css`
		border-bottom: 1px solid ${p.theme.palette.stealth};
	`}
`;

type ContentProps = {
	maxWidth: number;
};

const Content = styled.div<ContentProps>`
	flex: 1 1 auto;
	max-width: 800px;
	max-height: 600px;
	overflow: auto;
	padding: 16px;

	${p =>
		p.maxWidth &&
		css`
			max-width: ${p.maxWidth}px;
		`}
`;

const Footer = styled.footer`
	flex: 0 0 auto;
	min-height: 48px;
	padding: 12px 16px;

	${p => css`
		border-top: 1px solid ${p.theme.palette.stealth};
	`}
`;

export { Root, WindowLayout, Window, Header, Content, Footer };
