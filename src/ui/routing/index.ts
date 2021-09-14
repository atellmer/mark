const baseURL = '/';

const routes = {
	tester: `${baseURL}tester/`,
};

function createLinkToTester() {
	return routes.tester;
}

export { routes, createLinkToTester };
