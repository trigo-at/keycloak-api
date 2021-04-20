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
		let api, realmname, tokenProvider, users;
		before(async () => {
			realmname = `realm-${uuid()}`;
			api = new KeycloakApi(cfg);
			await api.waitForKeycloak();
			tokenProvider = specHelper.tokenProviderFactory();
			await api.createRealm({
				realm: {
					realm: realmname,
				},
				tokenProvider,
			});
			await api.createClient({
				realm: realmname,
				client: {
					clientId: 'test-client',
					secret: 'secret',
				},
				tokenProvider,
			});

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
			users = (await api.getUsers({realm: realmname, tokenProvider}))
				.data;
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider,
			});
		});

		it('update user properties', async () => {
			const res = await api.updateUser({
				realm: realmname,
				userId: users[0].id,
				user: {
					firstName: 'herbert',
					lastName: 'pichler',
				},
				tokenProvider,
			});

			expect(res.statusCode).to.equal(203);
		});
		it('update user custom attributes', async () => {
			const res = await api.updateUser({
				realm: realmname,
				userId: users[0].id,
				user: {
					firstName: 'herbert',
					lastName: 'pichler',
					attributes: {
						'address.street': ['Schulgassee', 'Beheimgasse'],
						'address.city': 'vienna',
						extraId: 42,
						married: false,
					},
				},
				tokenProvider,
			});

			expect(res.statusCode).to.equal(204);
			const ret = await api.getUser({
				realm: realmname,
				userId: users[0].id,
				tokenProvider,
			});
			const exp = {
				'address.street': ['Schulgassee', 'Beheimgasse'],
				'address.city': ['vienna'],
				extraId: ['42'],
				married: ['false'],
			};
			exp['address.street'].sort();
			ret.data.attributes['address.street'].sort();
			expect(ret.data.attributes).to.eql(exp);
		});
	}
);
