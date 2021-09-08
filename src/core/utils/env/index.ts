function detectIsLocalhost(): boolean {
	return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function logBuildInfo() {
	console.log('mode: ', process.env.NODE_ENV);
	console.log('branch: ', process.env.GIT_BRANCH);
	console.log('commithash: ', process.env.GIT_COMMITHASH);
}

export { detectIsLocalhost, logBuildInfo };
