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
		let api, realmname, componentNames;
		before(async () => {
			realmname = `realm-${uuid().substring(0, 8)}`;
			componentNames = [
				`test-component-${uuid().substring(0, 8)}`,
				`test-component-${uuid().substring(0, 8)}`,
				`test-component-${uuid().substring(0, 8)}`,
			];
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});

			for (const cn of componentNames) {
				const res = await api.createComponent({
					realm: realmname,
					component: {
						id: cn,
						name: cn,
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
			}
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('filter components by parentId', async () => {
			const res = await api.getComponents({
				realm: realmname,
				query: {
					parent: realmname,
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.greaterThanOrEqual(3);
			expect(res.data.map(d => d.name)).to.includes(componentNames[0]);
			expect(res.data.map(d => d.name)).to.includes(componentNames[1]);
			expect(res.data.map(d => d.name)).to.includes(componentNames[2]);
		});

		it('filter components by type', async () => {
			const res = await api.getComponents({
				realm: realmname,
				query: {
					componentType:
						'org.keycloak.userprofile.UserProfileProvider',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.greaterThanOrEqual(3);
			expect(res.data.map(d => d.name)).to.includes(componentNames[0]);
			expect(res.data.map(d => d.name)).to.includes(componentNames[1]);
			expect(res.data.map(d => d.name)).to.includes(componentNames[2]);
		});

		it('filter components by name', async () => {
			const res = await api.getComponents({
				realm: realmname,
				query: {
					componentType:
						'org.keycloak.userprofile.UserProfileProvider',
					name: componentNames[0],
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].name).to.equal(componentNames[0]);
		});
	}
);
