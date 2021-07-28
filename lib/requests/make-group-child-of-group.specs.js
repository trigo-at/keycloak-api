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
		let api, realmname, tokenProvider, groups;
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
			expect(
				(await api.createGroup({
					realm: realmname,
					group: {
						name: 'g2',
					},
					tokenProvider,
				})).statusCode
			).to.equal(201);

			const grpsres = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			groups = grpsres.data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('make the group child of the other', async () => {
			const res = await api.makeGroupChildOfGroup({
				realm: realmname,
				parentGroupId: groups[0].id,
				group: {
					id: groups[1].id,
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);
			expect(res.header).to.not.be.undefined
			const g = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			expect(g.data[0].subGroups[0].id).to.equal(groups[1].id);
			expect(g.header).to.not.be.undefined
		});
	}
);
