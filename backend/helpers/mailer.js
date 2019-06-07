const AWS = require('aws-sdk');
const ses = new AWS.SES({apiVersion: '2010-12-01', region: process.env.SES_REGION});

function sendAliveMessage(service) {
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
					Data: `The service with name ${service.name} just checked in, and is now up`
				},
				Text: {
					Charset: "UTF-8",
					Data: `The service with name ${service.name} just checked in, and is now up`
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Service ${service.name} is now up`
			}
		},
	};
	return ses.sendEmail(params).promise();
}

// TODO: Make it possible to send service restored emails
function sendDeadMessage(service) {
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

	return ses.sendEmail(params).promise();
};

module.exports = {
	sendAliveMessage,
	sendDeadMessage
};

