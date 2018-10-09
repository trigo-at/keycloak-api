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
		let api, realmname, tokenProvider, group;
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
			let res = await api.createGroup({
				realm: realmname,
				group: {
					name: 'herbert',
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
			res = await api.createGroup({
				realm: realmname,
				group: {
					name: 'franz',
					attributes: {
						test: ['prop'],
					},
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
			res = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);

			group = find(propEq('name', 'franz'), res.data);
		});

		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('return full group info', async () => {
			const g = await api.getGroup({
				realm: realmname,
				groupId: group.id,
				tokenProvider,
			});
			expect(g.statusCode).to.equal(200);
			expect(g.data.attributes.test).to.eql(['prop']);
		});
	}
);
