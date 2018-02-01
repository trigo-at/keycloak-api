'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe('updateUser', () => {
	let api,
		realmname,
		tokenProvider,
		users;
	before(async () => {
		realmname = `realm-${uuid()}`;
		api = new KeycloakApi(cfg);
		await api.waitForKeycloak();
		tokenProvider = specHelper.tokenProviderFactory();
		await api.createRealm({
			realm: {
				realm: realmname,
			},
			tokenProvider,
		});
		await api.createClient({
			realm: realmname,
			client: {
				clientId: 'test-client',
				secret: 'secret',
			},
			tokenProvider,
		});

		for (let i = 0; i < 3; i++) {
			await api.createUser({
				realm: realmname,
				user: {
					username: `u${i}`,
					lastName: `ln${i}`,
					firstName: `fn${i}`,
					email: `u${i}@test.com`,
				},
				tokenProvider,
			});
		}
		users = (await api.getUsers({ realm: realmname, tokenProvider })).data;
	});
	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});

	it('update user properties', async () => {
		const res = await api.updateUser({
			realm: realmname,
			userId: users[0].id,
			user: {
				firstName: 'herbert',
				lastName: 'pichler',
			},
			tokenProvider: specHelper.tokenProviderFactory(),
		});

		expect(res.statusCode).to.equal(204);
	});
});
