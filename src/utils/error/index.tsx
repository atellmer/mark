import { AxiosResponse } from 'axios';

type ApiError = {
	data: {
		errorType: string;
		errorMessage: string;
	};
} & AxiosResponse;

function createApiError(error: ApiError, text: string) {
	const errorText = `
		url: ${error?.config?.url || ''}
		message: ${error?.data?.errorMessage || ''}
		${text}
	`;

	console.error('api error', errorText);

	return errorText;
}
export { createApiError };
