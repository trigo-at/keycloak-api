'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe('deleteRealm', () => {
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

	it('returns server response object', async () => {
		const res = await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
		expect(res.statusCode).to.equal(204);
	});
});
