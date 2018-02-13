'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe(__filename.split('/').pop().split('.')[0], () => {
	let api, realmname;
	before(async () => {
		api = new KeycloakApi(cfg);
		await api.waitForKeycloak();
	});

	it('returns server response object', async () => {
		realmname = `realm-${uuid()}`;

		const res = await api.createRealm({
			realm: {
				realm: realmname,
			},
			tokenProvider: specHelper.tokenProviderFactory(),
		});
		expect(res.statusCode).to.equal(201);
	});
	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});
});
