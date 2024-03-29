'use strict';

const {expect} = require('chai');
const uuid = require('uuid');

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
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

		it('returns realm keys', async () => {
			const res = await api.getRealmKeys({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data.keys.find(k => k.type === 'RSA').publicKey).to.be.a(
				'string'
			);
			expect(res.header).to.not.be.undefined;
		});
	}
);
