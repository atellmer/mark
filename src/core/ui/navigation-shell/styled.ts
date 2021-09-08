import styled, { css } from 'styled-components';

const Root = styled.div`
	position: relative;
	width: 100%;
	min-height: 100vh;
	padding-top: 88px;
	display: flex;

	${p => css`
		background-color: ${p.theme.palette.space};
	`}

	@media(min-width: 600px) {
		padding-top: 48px;
	}
`;

const Header = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	min-height: 48px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px;

	${p => css`
		background-color: ${p.theme.palette.space};
		${p.theme.fn.createBoxShadow(1)}
	`}
`;

const ContentLayout = styled.div`
	width: 100%;
	display: flex;
	min-height: calc(100vh - 48px);
	align-items: center;
`;

const DocumentContent = styled.div`
	margin: auto;
	padding: 20px 16px 16px 16px;
`;

const FloatingPanelRoot = styled.div`
	position: fixed;
	top: 48px;
	left: 0;
	z-index: 100;
	padding: 8px 16px;
	width: 100%;

	${p => css`
		background-color: ${p.theme.palette.space};
		${p.theme.fn.createBoxShadow(1)};
	`}

	@media(min-width: 600px) {
		top: 68px;
		left: 16px;
		width: auto;
		padding: 16px;
	}
`;

export { Root, Header, ContentLayout, DocumentContent, FloatingPanelRoot };
