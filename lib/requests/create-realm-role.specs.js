'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe('createRealmRole', () => {
	let api, realmname, tokenProvider;
	before(async () => {
		realmname = `realm-${uuid()}`;
		tokenProvider = specHelper.tokenProviderFactory();
		api = new KeycloakApi(cfg);
		await api.waitForKeycloak();
		await api.createRealm({
			realm: {
				realm: realmname,
			},
			tokenProvider,
		});
	});

	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider,
		});
	});

	it('creates realm role', async () => {
		const res = await api.createRealmRole({
			realm: realmname,
			role: {
				name: 'herbert',
			},
			tokenProvider,
		});
		expect(res.statusCode).to.equal(201);
	});
});
