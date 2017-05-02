function is(type) {
	return function(sth) {
		return Object.prototype.toString.call(sth) == '[object ' + type + ']';
	}
}

module.exports = exports = {
	isString: is('String'),
	isArray: Array.isArray,
	isPlainObject: is('Object'),
}