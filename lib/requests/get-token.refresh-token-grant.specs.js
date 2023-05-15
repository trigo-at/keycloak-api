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
			const users = (
				await api.getUsers({
					realm: realmname,
					tokenProvider: specHelper.tokenProviderFactory(),
				})
			).data;
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

		it('get token with refresh token', async () => {
			let res = await api.getToken({
				realm: realmname,
				username: 'u1',
				password: 'password',
				clientId: 'test-client',
				clientSecret: 'secret',
				grantType: 'password',
			});
			expect(res.statusCode).to.equal(200);
			expect(res.header).to.not.be.undefined;
			const at = res.data.access_token;
			const rt = res.data.refresh_token;

			res = await api.getToken({
				realm: realmname,
				clientId: 'test-client',
				clientSecret: 'secret',
				grantType: 'refresh_token',
				refreshToken: res.data.refresh_token,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.header).to.not.be.undefined;
			expect(res.data.access_token).to.be.a('string');
			expect(res.data.access_token).to.not.equal(at);
			expect(res.data.refresh_token).to.be.a('string');
			expect(res.data.refresh_token).to.not.equal(rt);
		});
	}
);
