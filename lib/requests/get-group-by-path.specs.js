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
					attributes: {
						test: ['prop'],
					},
				},
				tokenProvider,
			});
			expect(res.statusCode).to.equal(201);
			expect(res.header).to.not.be.undefined;
			res = await api.getGroups({
				realm: realmname,
				tokenProvider,
			});
			expect(res.statusCode).to.equal(200);
			expect(res.header).to.not.be.undefined;
		});

		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('return found group', async () => {
			const g = await api.getGroupByPath({
				realm: realmname,
				path: '/herbert',
				tokenProvider,
			});
			expect(g.statusCode).to.equal(200);
			expect(g.data.name).to.eql('herbert');
			expect(g.header).to.not.be.undefined;
		});
	}
);
