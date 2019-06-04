// The units we can select as an interval for service check-ins
const validIntervalUnits = new Map();
validIntervalUnits.set('H', 'Hours');
validIntervalUnits.set('D', 'Days');
validIntervalUnits.set('W', 'Weeks');
validIntervalUnits.set('M', 'Months');
validIntervalUnits.set('Y', 'Years');

module.exports = {
	validIntervalUnits
}

