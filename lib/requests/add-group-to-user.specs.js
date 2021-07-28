'use strict';

const {expect} = require('chai');
const {find, propEq} = require('ramda');
const uuid = require('uuid');

const KeycloakApi = require('../keycloak-api');
const cfg = require('../../specs/test-config');
const specHelper = require('../../specs/helper');

describe(
	__filename
		.split('/')
		.pop()
		.split('.')[0],
	() => {
		let api, realmname, users, group, tokenProvider;
		before(async () => {
			realmname = `realm-${uuid()}`;
			api = new KeycloakApi(cfg);
			tokenProvider = specHelper.tokenProviderFactory();
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
					enabled: true,
					directGrantFlow: 'direct grant',
					resetCredentialsFlow: 'reset credentials',
					clientAuthenticationFlow: 'clients',
				},
				tokenProvider,
			});

			expect(
				(await api.createGroup({
					realm: realmname,
					group: {
						name: 'g1',
					},
					tokenProvider,
				})).statusCode
			).to.equal(201);

			const grpsres = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			group = find(propEq('name', 'g1'), grpsres.data);

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
			users = (await api.getUsers({
				realm: realmname,
				tokenProvider,
			})).data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('adds the user to the group', async () => {
			const res = await api.addGroupToUser({
				realm: realmname,
				userId: users[0].id,
				groupId: group.id,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined
		});
	}
);
