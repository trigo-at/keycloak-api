'use strict';

const { expect } = require('chai');
const uuid = require('uuid');
const KeycloakApi = require('./keycloak-api');
const specHelper = require('../specs/helper');
const cfg = require('../specs/test-config');

describe(__filename.split('/').pop().split('.')[0], () => {
	let api,
		realmname;
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
				accessTokenLifespan: 600,
			},
			tokenProvider,
		});
	});

	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});
	describe('token management', () => {
		it('caches the retrieved token as tokenProvide.__currentToken', async () => {
			const tokenProvider = specHelper.tokenProviderFactory();
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});

			expect(tokenProvider.__currentToken).to.be.an('object');
			expect(tokenProvider.__currentToken.token).to.be.a('string');
			expect(tokenProvider.__currentToken.decrypted).to.be.an('object');
			expect(tokenProvider.__currentToken.expiresAt).to.be.a('date');
		});

		it('reuses cached token on next request', async () => {
			const tokenProvider = specHelper.tokenProviderFactory();
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});
			const firstToken = tokenProvider.__currentToken.token;
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});
			const secondToken = tokenProvider.__currentToken.token;

			expect(secondToken).to.equal(firstToken);
		});

		it('fetches new token if the cached token is about to expire', async () => {
			const tokenProvider = specHelper.tokenProviderFactory();
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});
			const firstToken = tokenProvider.__currentToken.token;
			tokenProvider.__currentToken.expiresAt = new Date();

			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});
			const secondToken = tokenProvider.__currentToken.token;

			expect(secondToken).not.to.equal(firstToken);
		});
	});
});
