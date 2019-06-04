import { Auth, API } from 'aws-amplify';

const apiName = 'ApiGatewayRestApi';
const methods = ['get', 'post', 'put', 'del'];

async function authenticatedRequest(method, url, init = {}) {
	const currentToken = (await Auth.currentSession()).idToken.jwtToken;
	const authHeader = { Authorization:  currentToken };
	const authenticatedInit = { ...init, headers: {...authHeader, ...init.headers } };
	// The magical name ApiGatewayRestApi comes from the ./aws-exports file, so originally from serverless
	return await API[method](apiName, url, authenticatedInit);
}

const client = methods.reduce((acc, m) => {
	return {...acc, [m]: (url, init) => authenticatedRequest(m, url, init) };
}, {});

client.getBasePath = () => API.endpoint(apiName);

console.log(client);
export default client;


