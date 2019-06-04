'use strict';

const AWS = require('aws-sdk');
const responses = require('../helpers/responses');
const utils = require('../helpers/utils');

const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const CHECKINS_TO_KEEP = 25;

module.exports.handler = async (event) => {
	const serviceId = event.pathParameters.serviceId;
	const apiKey = event.headers['x-api-key'];

	// Get existing service
	const existingService = await utils.getServiceById(db, process.env.SERVICES_TABLE, serviceId);
	if (!existingService) {
		return responses.NotFound().getResponse();
	}
	if (existingService.ApiKey !== apiKey) {
		return responses.Forbidden().getResponse();
	}

	const date = new Date().toISOString();

	if (!existingService.checkins) {
		existingService.checkins = [];
	}
	existingService.checkins.unshift(date);
	existingService.checkins = existingService.checkins.slice(0, CHECKINS_TO_KEEP);
	existingService.isHealthy = true;

	const updateParams = {
		TableName: process.env.SERVICES_TABLE,
		Item: existingService
	}

	// Save our changes
	try {
		await db.put(updateParams).promise();
		return responses.NoContentResponse().getResponse();
	} catch (e) {
		console.log(e);
		return responses.InternalServerError(e.message).getResponse();
	}
};
