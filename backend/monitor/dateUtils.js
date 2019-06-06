const DateDiff = require('date-diff');
const HOUR_MS = 60 * 60 * 1000;

const d1 = new Date(2019, 4, 5, 12, 0, 0);
const d2 = new Date(2019, 5, 4, 16, 0, 0);

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
