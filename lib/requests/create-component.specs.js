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
			realmname = `realm-${uuid().substring(0, 8)}`;
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
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
		it('creates a new component', async () => {
			const res = await api.createComponent({
				realm: realmname,
				component: {
					id: 'test-component',
					name: 'test-component',
					parentId: realmname,
					providerId: 'declarative-user-profile',
					providerType:
						'org.keycloak.userprofile.UserProfileProvider',
					config: {
						prop1: ['VAL1', 'VAL2'],
						prop2: ['VAL2_1', 'VAL2_2'],
					},
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(201);
			expect(res.header).to.not.be.undefined;
		});
	}
);
