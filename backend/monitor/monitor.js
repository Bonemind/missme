'use strict';
const AWS = require('aws-sdk');

const dateUtils = require('./dateUtils');
const mailer = require('../helpers/mailer');
const responses = require('../helpers/responses');

const db = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
	const params = {
		TableName: process.env.SERVICES_TABLE
	};

	const serviceResults = await db.scan(params).promise();

	if (!serviceResults || !serviceResults.Items) {
		throw new Error('serviceResults has no sane value');
		return;
	}

	// List of services that have transitioned to unhealthy this invocation
	// These are also the services a notification will be sent out for
	const newUnhealthy = [];

	serviceResults.Items.forEach(s => {
		// This service is already unhealthy, no point in checking it
		if (s.isHealthy === false) {
			return;
		}

		// We've never seen this service yet, skip
		if (!s.checkins || s.checkins.length === 0) {
			return;
		}
		
		const mostRecent = new Date(s.checkins[0]);
		const diff = dateUtils[s.interval.unit](mostRecent);

		if (diff > s.threshold) {
			s.isHealthy = false;
			newUnhealthy.push(s);
		}
	});

	// Send emails
	const mailPromises = newUnhealthy.map(mailer.sendDeadMessage);
	await Promise.all(mailPromises);

	// Update services
	const updates = newUnhealthy.map(s => {
		const itemUpdate = {
			TableName: process.env.SERVICES_TABLE,
			Item: s
		};
		return db.put(itemUpdate).promise();
	});

	await Promise.all(updates);

	return responses.SuccessResponse(newUnhealthy).getResponse();
};
