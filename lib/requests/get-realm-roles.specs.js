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

		it('return realm roles', async () => {
			const res = await api.getRealmRoles({
				realm: realmname,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
		});
	}
);
