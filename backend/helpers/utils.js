const uuidv4 = require('uuid/v4');

const DEFAULT_ID_LENGTH = 7;

function generateId(length = DEFAULT_ID_LENGTH) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function generateApiKey() {
	return uuidv4();
}

// Fetches a user's document from the database and tablename
async function getServiceById(db, TableName, serviceId) {
	const params = {
		TableName: TableName,
		Key: {
			'ServiceId': serviceId
		}
	};

	try {
		const result = await db.get(params).promise();
		return result.Item || null;
	} catch (e) {
		console.log(e);
	}
	return null;
}

module.exports = {
	generateId: generateId,
	generateApiKey: generateApiKey,
	getServiceById: getServiceById
};
