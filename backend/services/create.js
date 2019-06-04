'use strict';
const AWS = require('aws-sdk');
const responses = require('../helpers/responses');
const utils = require('../helpers/utils');
const validator = require('./validator');

const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
	const claims = event.requestContext.authorizer.claims;
	const email = claims.email.toLowerCase();

	let validated = {};
	try {
		validated = validator.validateInput(event.body, true);
	} catch(e) {
		return responses.InternalServerError(e).getResponse();
	}

	if (validated.errors) {
		return responses.BadRequest(validated).getResponse();
	}

	const newService = {
		ServiceId: utils.generateId(),
		UserId: email,
		ApiKey: utils.generateApiKey(),
		threshold: 0,
		description: "",
		...validated
	};

	const insertParams = {
		TableName: process.env.SERVICES_TABLE,
		Item: newService
	}

	// Save our changes
	try {
		await db.put(insertParams).promise();
		return responses.SuccessResponse(newService).getResponse();
	} catch (e) {
		console.log(e);
		return responses.InternalServerError(e.message).getResponse();
	}
};
