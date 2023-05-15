'use strict';

const {expect} = require('chai');
const uuid = require('uuid');
const {find, propEq} = require('ramda');

const KeycloakApi = require('../keycloak-api');
const cfg = require('../../specs/test-config');
const specHelper = require('../../specs/helper');

describe(
	__filename
		.split('/')
		.pop()
		.split('.')[0],
	() => {
		let api,
			realmname,
			client,
			rmClient,
			user,
			availableRoles,
			tokenProvider;
		before(async () => {
			tokenProvider = specHelper.tokenProviderFactory();
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

			availableRoles = (
				await api.getAvailableClientRolesForUser({
					realm: realmname,
					userId: user.id,
					clientId: rmClient.id,
					tokenProvider,
				})
			).data;

			expect(
				(
					await api.addClientRolesToUser({
						realm: realmname,
						userId: user.id,
						clientId: rmClient.id,
						roles: [availableRoles[0], availableRoles[1]],
						tokenProvider,
					})
				).statusCode
			).to.equal(204);
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('removes the roles from the user', async () => {
			const res = await api.removeClientRolesFromUser({
				realm: realmname,
				userId: user.id,
				clientId: rmClient.id,
				roles: [availableRoles[1]],
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined;
			const urs = (
				await api.getClientRolesForUser({
					realm: realmname,
					userId: user.id,
					clientId: rmClient.id,
					tokenProvider,
				})
			).data;
			expect(find(propEq('id', availableRoles[1].id), urs)).not.to.exist;
		});
	}
);
