
exports.today = function(val) {
	var date = val || new Date();
	date.setHours(0,0,0,0);
	return date;
}

exports.now = function() {
	var date = new Date();
	return date;
}

var ONE_HOUR_MILLS = 60 * 60 * 1000;

exports.ONE_HOUR_MILLS = ONE_HOUR_MILLS;
exports.ONE_DAY_MILLS = 24 * ONE_HOUR_MILLS;
