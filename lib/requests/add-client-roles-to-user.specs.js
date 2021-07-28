'use strict';

const {expect} = require('chai');
const uuid = require('uuid');

const KeycloakApi = require('../keycloak-api');
const cfg = require('../../specs/test-config');
const specHelper = require('../../specs/helper');

describe(
	__filename
		.split('/')
		.pop()
		.split('.')[0],
	() => {
		let api, realmname, client, rmClient, user, availableRoles;
		before(async () => {
			const tokenProvider = specHelper.tokenProviderFactory();
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
				tokenProvider,
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
				tokenProvider,
			});

			const clients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'test-service-client',
				},
				tokenProvider,
			});
			client = clients.data[0];
			const userRes = await api.getServiceAccountUser({
				realm: realmname,
				clientId: client.id,
				tokenProvider,
			});
			user = userRes.data;
			const rmClients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'realm-management',
				},
				tokenProvider,
			});
			rmClient = rmClients.data[0];

			availableRoles = (await api.getAvailableClientRolesForUser({
				realm: realmname,
				userId: user.id,
				clientId: rmClient.id,
				tokenProvider,
			})).data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('adds the roles to the user', async () => {
			const res = await api.addClientRolesToUser({
				realm: realmname,
				userId: user.id,
				clientId: rmClient.id,
				roles: [availableRoles[0], availableRoles[1]],
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined
		});
	}
);
