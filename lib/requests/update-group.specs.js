'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const {expect} = require('chai');
const {propEq, find} = require('ramda');
const uuid = require('uuid');
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

		it('updates group attributes', async () => {
			const g = await getGroup('herbert');
			const res = await api.updateGroup({
				realm: realmname,
				groupId: g.id,
				group: {
					id: g.id,
					attributes: {
						'at:trigo:test:prop1': ['42'],
						'at:trigo:test:prop2': ['a', 'b', 32],
					},
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(204);

			const ag = await api.getGroup({
				realm: realmname,
				groupId: g.id,
				tokenProvider,
			});
			expect(ag.data.attributes['at:trigo:test:prop1']).to.eql(['42']);
			expect(ag.data.attributes['at:trigo:test:prop2']).to.eql([
				'a',
				'b',
				'32',
			]);
		});
	}
);
