'use strict';

const { expect } = require('chai');
const KeycloakApi = require('./');
const cfg = require('./specs/test-config');

describe('index', () => {
	it('can instantiate a new API instacne', () => {
		const api = new KeycloakApi(cfg);
		expect(api.getToken).to.be.a('function');
	});
});
