'use strict';

const {expect} = require('chai');
const {propEq, find} = require('ramda');
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
		let api, realmname, tokenProvider;
		before(async () => {
			realmname = `realm-${uuid()}`;
			tokenProvider = specHelper.tokenProviderFactory();
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			await api.createRealm({
				realm: {
					realm: realmname,
				},
				tokenProvider,
			});
			const res = await api.createGroup({
				realm: realmname,
				group: {
					name: 'herbert',
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
		});

		const getGroup = async name => {
			const res = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			const grp = find(propEq('name', name), res.data);
			expect(grp).to.exist;

			return grp;
		};

		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('deletes group', async () => {
			const group = await getGroup('herbert');
			const res = await api.deleteGroup({
				realm: realmname,
				groupId: group.id,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);

			const getRes = await api.getGroup({
				realm: realmname,
				groupId: group.id,
				tokenProvider,
			});
			expect(getRes.statusCode).to.equal(404);
		});
	}
);
