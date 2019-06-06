// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// TODO: Make it possible to send service restored emails
function sendServiceEmail(service) {
	const params = {
		Source: process.env.SES_FROM_EMAIL,
		Destination: {
			ToAddresses: [
				service.UserId
			]
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: `The service with name ${service.name} has failed to check, and is now down`
				},
				Text: {
					Charset: "UTF-8",
					Data: `The service with name ${service.name} has failed to check, and is now down`
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Service ${service.name} is missing`
			}
		},
	};
	const sendPromise = new AWS.SES({apiVersion: '2010-12-01', region: process.env.SES_REGION}).sendEmail(params).promise();
	return sendPromise;
};

module.exports = {
	sendServiceEmail
};

