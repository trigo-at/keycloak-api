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
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
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

		it('retun all clients', async () => {
			const res = await api.getClients({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.gt(1);
			expect(res.header).to.not.be.undefined;
		});

		it('filter clientId', async () => {
			const res = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'test-client',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].clientId).to.equal('test-client');
			expect(res.header).to.not.be.undefined;
		});
	}
);
