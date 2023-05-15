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
		let api, realmname, users, tokenProvider;
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
			users = (
				await api.getUsers({
					realm: realmname,
					tokenProvider,
				})
			).data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('deletes the user', async () => {
			const res = await api.deleteUser({
				realm: realmname,
				userId: users[0].id,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined;

			const getRes = await api.getUser({
				realm: realmname,
				userId: users[0].id,
				tokenProvider,
			});
			expect(getRes.statusCode).to.equal(404);
			expect(getRes.header).to.not.be.undefined;
		});
	}
);
