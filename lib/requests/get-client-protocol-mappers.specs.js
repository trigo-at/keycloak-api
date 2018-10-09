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
		let api, realmname, client, tokenProvider;
		before(async () => {
			realmname = `realm-${uuid()}`;
			api = new KeycloakApi(cfg);
			tokenProvider = specHelper.tokenProviderFactory();
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
				},
				tokenProvider,
			});

			const clients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'realm-management',
				},
				tokenProvider,
			});
			client = clients.data[0];
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('retun all client protocol mappers by protocol', async () => {
			const res = await api.getClientProtocolMappers({
				realm: realmname,
				clientId: client.id,
				protocol: 'openid-connect',
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.gt(1);
		});

		it('retun all client protocol mappers using default protocol="openid-connect"', async () => {
			const res = await api.getClientProtocolMappers({
				realm: realmname,
				clientId: client.id,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.gt(1);
		});
	}
);
