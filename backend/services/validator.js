const allowedFields = ["name", "interval", "threshold", "description"];
const requiredFields = ["name", "interval"];
const validUnits = ['Y', 'M', 'W', 'D', 'H'];

function isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function validateInput(input, checkRequired = false) {
	let validated;

	// Basic validations
	try {
		const parsed = JSON.parse(input);

		// Only keep the fields that are allowed
		validated = allowedFields.reduce((acc, value) => {
			if (parsed[value]) {
				return { ...acc, [value]: parsed[value] };
			}
			return acc;
		}, {});
	} catch (e) {
		console.log(e);
		return { input: input, errors: 'Could not validate body' };
	}

	// Check required fields if enabled
	const missingFields = requiredFields.filter(rf => !validated[rf]);
	if (checkRequired && missingFields.length != 0) {
		return { input: validated, errors: `The fields: ${missingFields.join(', ')} are required` }
	}

	// Build a list of validation errors
	const errors = {};

	if (validated.name && validated.name.length < 3) {
		errors['name'] = 'Should be 3 characters or longer';
	}

	if (validated.threshold && isNaN(validated.threshold)) {
		errors['threshold'] = 'Should be a valid number';
	} else if (validated.threshold && validated.threshold < 0) {
		errors['threshold'] = 'Should be a positive number';
	}

	// Validate the interval object if it exists
	if (validated.interval) {
		const interval = { unit: validated.interval.unit, count: validated.interval.count };
		if (!interval.count || isNaN(interval.count) || interval.count <= 0) {
			errors['interval.count'] = 'Should be a positive number';
		}
		if (!interval.unit) {
			errors['interval.unit'] = 'Unit is required for interval';
		} else if (!validUnits.includes(interval.unit)) {
			errors['interval.unit'] = `Unit ${interval.unit} is not a valid unit`;
		}
		validated.interval = interval;
	}
	
	if (!isEmptyObject(errors)) {
		return { input: validated, errors };
	}

	return validated;
}

module.exports = {
	validateInput
}
