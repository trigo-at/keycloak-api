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
		let api, realmname, client;
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

			const clients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'realm-management',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			client = clients.data[0];
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('creates the role', async () => {
			const res = await api.createClientRole({
				realm: realmname,
				clientId: client.id,
				role: {
					name: 'test-role',
					clientRole: true,
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(201);
		});
	}
);
