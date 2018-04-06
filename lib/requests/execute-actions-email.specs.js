'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const {expect} = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe(
	__filename
		.split('/')
		.pop()
		.split('.')[0],
	() => {
		let api, realmname, user;
		before(async () => {
			realmname = `realm-${uuid()}`;
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
					smtpServer: {
						auth: true,
						from: 'test@test.com',
						host: 'smtp.mailtrap.io',
						user: '03a5f83b9804b8',
						password: '864d845780a69e',
						port: 2525,
					},
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});

			for (let i = 0; i < 3; i++) {
				await api.createUser({
					realm: realmname,
					user: {
						username: `u${i}`,
						lastName: `ln${i}`,
						firstName: `fn${i}`,
						email: `u${i}@test.com`,
						enabled: true,
					},
					tokenProvider: specHelper.tokenProviderFactory(),
				});
			}

			[user] = (await api.getUsers({
				realm: realmname,
				query: {username: 'u1'},
				tokenProvider: specHelper.tokenProviderFactory(),
			})).data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('triggers email to be sent', async () => {
			const res = await api.executeActionsEmail({
				realm: realmname,
				userId: user.id,
				actions: ['UPDATE_PASSWORD'],
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
		});
	}
);
