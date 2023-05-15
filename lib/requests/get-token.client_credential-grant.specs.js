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
					clientId: 'test-service-client',
					secret: 'secret',
					enabled: true,
					clientAuthenticatorType: 'client-secret',
					serviceAccountsEnabled: true,
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('returns server response object', async () => {
			const res = await api.getToken({
				realm: realmname,
				clientId: 'test-service-client',
				clientSecret: 'secret',
				grantType: 'client_credentials',
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data.access_token).to.be.a('string');
			expect(res.header).to.not.be.undefined;
		});
	}
);
