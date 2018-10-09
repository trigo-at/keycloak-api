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
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
		});

		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('returns all groups', async () => {
			const res = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data.length).to.eql(2);

			expect(find(propEq('name', 'franz'), res.data)).to.exist;
			expect(find(propEq('name', 'herbert'), res.data)).to.exist;
		});
	}
);
