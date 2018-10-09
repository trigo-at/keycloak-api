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
		let api, realmname, client, rmClient, user;
		before(async () => {
			realmname = `realm-${uuid()}`;
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
					enabled: true,
					directGrantFlow: 'direct grant',
					resetCredentialsFlow: 'reset credentials',
					clientAuthenticationFlow: 'clients',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});

			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-service-client',
					secret: 'secret',
					enabled: true,
					clientAuthenticatorType: 'client-secret',
					serviceAccountsEnabled: true,
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});

			const clients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'test-service-client',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			client = clients.data[0];
			const userRes = await api.getServiceAccountUser({
				realm: realmname,
				clientId: client.id,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			user = userRes.data;
			const rmClients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'realm-management',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			rmClient = rmClients.data[0];
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('returns client roles', async () => {
			const res = await api.getClientRolesForUser({
				realm: realmname,
				userId: user.id,
				clientId: rmClient.id,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
		});
	}
);
