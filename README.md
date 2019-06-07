# Missme

Missme is a simple monitoring service that allows you to configure a "service", and a rate at which you expect it to check in.
As long as it checks in, all is well, when it misses a check in (or multiple, depending on your threshold),
you'll get an email notifying you that something is wrong.

Checking in is kept as simple as possible by issuing a GET request to a certain endpoint:

```
curl -H "x-api-key: <Api key>" <Api path>/dev/notify/<Service id>

```

Missme is built to be deployed serverlessly on the AWS platform.

## Deployment

Requirements:

- [Severless](https://serverless.com/)
- [Amplify](https://aws-amplify.github.io/)
- [AWS Cli](https://aws.amazon.com/cli/)

Once you have the prerequisite tooling installed, configure your AWS credentials using the AWS cli.

For backend deployment you'll need to copy `ses_config.example.yml` to `ses_config.yml` and fill in the
yaml with your own values. After that run `npm i` in the `backend` folder, followed by `sls deploy`.

This will create an api gateway, dynamodb table, configure the lambda functions, and provision a cognito user pool for authentication.
It will also write the `aws-exports.js` file to `frontend/src/aws-exports.js` which is needed by the frontend to authenticate
and communicate with the api. It will also display some info about where your backend is located.

Lastly, cd into the `frontend` folder and run `npm i`. When this is done, you can deploy the frontend using `amplify publish` which
will build and upload the frontend to AWS and display a link where it can be found. Before you can deploy the frontend you need to add
hosting using the `amplify hosting add` command.

## Usage:

Create an account or login to your frontend, click `Add service` to create a service, and configure it as you see fit.
The interval is how often you expect a service to check in (e.g. "hours 4" will expect to see the service every 4 hours).
The threshold is how many times in a row a service is allowed to miss a check in (e.g. a "days 1" service with a threshold of 3 will only notify you if there haven't been any check ins for 4 days). You will only be notified once if a service goes missing, after which missme stays silent until the service checks back in at least once. This means missed check ins since you've been notified won't trigger more emails till the service shows back up. Assumption is that you've seen the email and are working on fixing the service when you have time.

After you've created a service you can click on it to see your api key, id, and a curl example of you to check in. A check in is always a GET request with no body and the api key as a header. If all goes well, you get a `204` status code back.

The service overview gives a list of statusses per service, which mean the following:

	- Ok: The service has checked in at least once, and hasn't been missing long enough to go over its threshold.
	- Dead: The service has checked in at least once, and has missed enough check ins to go over its threshold.
	- Unknown: The service has been configured, but has never checked in.


