'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe('getClients', () => {
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
	});
});
