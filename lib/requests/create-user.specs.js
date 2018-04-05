'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const {expect} = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe(
	__filename
		.split('/')
		.pop()
		.split('.')[0],
	() => {
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

		it('creates new user', async () => {
			const res = await api.createUser({
				realm: realmname,
				user: {
					username: 'test-user',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(201);
		});
	}
);
