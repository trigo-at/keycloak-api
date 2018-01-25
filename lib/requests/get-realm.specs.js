'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe('getRealm', () => {
	let api, realmname;
	before(async () => {
		realmname = `realm-${uuid()}`;
		api = new KeycloakApi(cfg);
		await api.waitForKeycloak();
		await api.createRealm({
			realm: {
				realm: realmname,
			},
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});
	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});

	it('return realm when found', async () => {
		const res = await api.getRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
		expect(res.statusCode).to.equal(200);
		expect(res.data.realm).to.equal(realmname);
	});
});
