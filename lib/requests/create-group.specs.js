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
		});

		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('creates group', async () => {
			const res = await api.createGroup({
				realm: realmname,
				group: {
					name: 'herbert',
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
		});

		it('creates subgroup when parent group id is provided', async () => {
			const res = await api.createGroup({
				realm: realmname,
				group: {
					name: 'g1',
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);

			let g1 = find(
				propEq('name', 'g1'),
				(await api.getGroups({realm: realmname, tokenProvider})).data
			);

			const res2 = await api.createGroup({
				realm: realmname,
				group: {
					name: 'g2',
				},
				parentGroupId: g1.id,
				tokenProvider,
			});
			expect(res2.statusCode).to.equal(201);

			const getRes = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			g1 = find(propEq('name', 'g1'), getRes.data);
			expect(g1.subGroups.length).to.equal(1);
			expect(g1.subGroups[0].name).to.equal('g2');
		});
	}
);
