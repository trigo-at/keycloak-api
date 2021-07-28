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
		let api, realmname, client, tokenProvider;
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

			const clients = await api.getClients({
				realm: realmname,
				query: {
					clientId: 'realm-management',
				},
				tokenProvider,
			});
			client = clients.data[0];
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('creates new mapper', async () => {
			const res = await api.createClientProtocolMapper({
				realm: realmname,
				clientId: client.id,
				mapper: {
					name: 'custom_email',
					protocol: 'openid-connect',
					protocolMapper: 'oidc-usermodel-attribute-mapper',
					consentRequired: false,
					config: {
						'userinfo.token.claim': true,
						'user.attribute': 'custom_email',
						'id.token.claim': true,
						'access.token.claim': true,
						'claim.name': 'custom_email',
						'jsonType.label': 'String',
					},
				},
				tokenProvider,
			});

			expect(res.statusCode).to.equal(201);
			expect(res.header).to.not.be.undefined
		});
	}
);
