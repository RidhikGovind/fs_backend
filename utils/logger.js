/**
 * contains the info and error logging messages
 */
const info = (...params) => {
	console.log(...params);
};
const error = (...params) => {
	console.log(...params);
};

module.exports = {
	info,
	error,
};
