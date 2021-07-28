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
		let api, realmname, tokenProvider;
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
					id: '42',
					clientId: 'test-client',
				},
				tokenProvider,
			});
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('updates the client', async () => {
			const res = await api.updateClient({
				realm: realmname,
				clientId: '42',
				client: {
					id: '42',
					clientId: 'test-client-mod',
					secret: 'test',
					protocolMappers: [
						{
							name: 'Client ID',
							protocol: 'openid-connect',
							protocolMapper: 'oidc-usersessionmodel-note-mapper',
							consentRequired: false,
							consentText: '',
							config: {
								'user.session.note': 'clientId',
								'id.token.claim': 'true',
								'access.token.claim': 'true',
								'claim.name': 'clientId',
								'jsonType.label': 'String',
							},
						},
					],
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined
		});
	}
);
