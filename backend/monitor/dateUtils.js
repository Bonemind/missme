const DateDiff = require('date-diff');

function getElapsed(unit, since) {
	return Math.floor(new DateDiff(new Date(), since)[unit]());
}

module.exports = {
	'Y': (d) => getElapsed('years', d),
	'M': (d) => getElapsed('months', d),
	'W': (d) => getElapsed('weeks', d),
	'D': (d) => getElapsed('days', d),
	'H': (d) => getElapsed('hours', d)
};
