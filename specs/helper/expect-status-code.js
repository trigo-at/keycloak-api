'use strict';

const {expect} = require('chai');

const expectStatusCode = expectedStatus => ({statusCode} = {}) =>
	expect(statusCode).to.equal(expectedStatus);

module.exports = expectStatusCode;
