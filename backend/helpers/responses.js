// Lambda API-Gateway response wrappers
class BaseError {
	constructor(message, statusCode) {
		this.message = message;
		this.statusCode = statusCode;
	}

	getResponse() {
		return {
			headers: {
				"Access-Control-Allow-Origin" : "*"
			},
			body: JSON.stringify({ message: this.message }),
			statusCode: this.statusCode
		};
	}
}

const BadRequest = (message = 'Bad request') => new BaseError(message, 400);
const Unauthorized = (message = 'Unauthorized') => new BaseError(message, 401)
const Forbidden = (message = 'Forbidden') => new BaseError(message, 403)
const NotFound = (message = 'Not found') => new BaseError(message, 404);
const InternalServerError = (message = 'Internal server error') => new BaseError(message, 500);

class BaseResponse {
	constructor(body, statusCode) {
		this.body = body;
		this.statusCode = statusCode;
	}

	getResponse() {
		return {
			headers: {
				"Access-Control-Allow-Origin" : "*" // Required for CORS support to work
			},
			body: JSON.stringify(this.body),
			statusCode: this.statusCode
		};
	}
}

const SuccessResponse = (body = {}) => new BaseResponse(body, 200);
const NoContentResponse = () => new BaseResponse(null, 204);

module.exports = {
	BaseError,
	BadRequest,
	Unauthorized,
	Forbidden,
	NotFound,
	InternalServerError,
	BaseResponse,
	SuccessResponse,
	NoContentResponse
}
