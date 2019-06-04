'use strict';
const AWS = require('aws-sdk');
const responses = require('../helpers/responses');
const utils = require('../helpers/utils');

const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
	const claims = event.requestContext.authorizer.claims;
	const email = claims.email.toLowerCase();
	const serviceId = event.pathParameters ? event.pathParameters.serviceId : null;

	if (serviceId) {
		// Get existing service
		const existingService = await utils.getServiceById(db, process.env.SERVICES_TABLE, serviceId);
		if (!existingService) {
			return responses.NotFound().getResponse();
		}
		if (existingService.UserId !== email) {
			console.log(email);
			console.log(existingService);
			return responses.Forbidden().getResponse();
		}
		return responses.SuccessResponse(existingService).getResponse();
	}

	// Get services
	var params = {
		TableName : process.env.SERVICES_TABLE,
		FilterExpression : 'UserId = :user_id',
		ExpressionAttributeValues : {':user_id' : email}
	};

	try {
		const data = await db.scan(params).promise();
		return responses.SuccessResponse(data).getResponse();
	} catch (e) {
		console.log(e);
		return responses.InternalServerError(e.message).getResponse();
	}
};
