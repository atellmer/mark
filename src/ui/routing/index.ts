const baseURL = '/';

const routes = {
	root: `${baseURL}root/`,
};

function createLinkToRoot() {
	return routes.root;
}

export { routes, createLinkToRoot };
