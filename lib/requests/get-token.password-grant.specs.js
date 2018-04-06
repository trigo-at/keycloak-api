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
		let api, realmname;
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
					clientId: 'test-client',
					secret: 'secret',
					enabled: true,
					directAccessGrantsEnabled: true,
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
						emailVerified: true,
					},
					tokenProvider: specHelper.tokenProviderFactory(),
				});
			}
			const users = (await api.getUsers({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			})).data;
			for (const user of users) {
				await api.setUserPassword({
					realm: realmname,
					userId: user.id,
					password: 'password',
					tokenProvider: specHelper.tokenProviderFactory(),
				});
			}
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('get token for user', async () => {
			const res = await api.getToken({
				realm: realmname,
				username: 'u1',
				password: 'password',
				clientId: 'test-client',
				clientSecret: 'secret',
				grantType: 'password',
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data.access_token).to.be.a('string');
			expect(res.data.refresh_token).to.be.a('string');
		});
	}
);
