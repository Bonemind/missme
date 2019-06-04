'use strict';
const AWS = require('aws-sdk');
const responses = require('../helpers/responses');
const utils = require('../helpers/utils');
const validator = require('./validator');

const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
	const claims = event.requestContext.authorizer.claims;
	const email = claims.email.toLowerCase();
	const serviceId = event.pathParameters.serviceId;

	// Get existing service
	const existingService = await utils.getServiceById(db, process.env.SERVICES_TABLE, serviceId);
	if (!existingService) {
		return responses.NotFound().getResponse();
	}
	if (existingService.UserId !== email) {
		return responses.Forbidden().getResponse();
	}
	

	const deleteParams = {
		TableName: process.env.SERVICES_TABLE,
		Key: {
			ServiceId: serviceId
		}
	}

	// Save our changes
	try {
		await db.delete(deleteParams).promise();
		return responses.NoContentResponse().getResponse();
	} catch (e) {
		console.log(e);
		return responses.InternalServerError(e.message).getResponse();
	}
};
