'use strict';

function abort(err) {
	const errObj = Object.assign({}, err);
	if (errObj.data && errObj.data.error_description) {
		errObj.data.message = errObj.data.error_description;
		delete errObj.data.error_description;
	}
	console.error(`ERROR: ${errObj.statusCode} ${JSON.stringify(errObj)}`);// eslint-disable-line
	console.log(JSON.stringify(errObj, null, 2));// eslint-disable-line
	process.exit(1);
}

function assert(response, statusCode, customError) {
	if (response.statusCode !== statusCode) {
		abort(customError || response);
	}
	return response;
}
function assertNot(response, statusCode, customError) {
	if (response.statusCode === statusCode) {
		abort(customError || response);
	}
	return response;
}

function assertNotAuthError(response) {
	return assertNot(response, 401);
}

function print(response, noExit) {
	if (response.statusCode >= 400) {
		abort(response);
	}
	console.log(JSON.stringify(response, null, 4)); // eslint-disable-line
	if (!noExit) {
		process.exit(0);
	}
}

module.exports = {
	abort,
	assert,
	assertNot,
	assertNotAuthError,
	print,
};
