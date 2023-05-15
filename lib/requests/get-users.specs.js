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
		let api, realmname;
		before(async () => {
			realmname = `realm-${uuid()}`;
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
					secret: 'secret',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
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
					tokenProvider: specHelper.tokenProviderFactory(),
				});
			}
		});
		after(async () => {
			await api.deleteRealm({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
		});

		it('retun all users', async () => {
			const res = await api.getUsers({
				realm: realmname,
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.eq(3);
			expect(res.header).to.not.be.undefined;
		});

		it('query username', async () => {
			const res = await api.getUsers({
				realm: realmname,
				query: {
					username: 'u2',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].username).to.equal('u2');
			expect(res.header).to.not.be.undefined;
		});

		it('query fisrtName', async () => {
			const res = await api.getUsers({
				realm: realmname,
				query: {
					firstName: 'fn2',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].firstName).to.equal('fn2');
			expect(res.header).to.not.be.undefined;
		});
		it('query lastName', async () => {
			const res = await api.getUsers({
				realm: realmname,
				query: {
					lastName: 'ln2',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].lastName).to.equal('ln2');
			expect(res.header).to.not.be.undefined;
		});
		it('query email', async () => {
			const res = await api.getUsers({
				realm: realmname,
				query: {
					email: 'u2@test.com',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.data[0].email).to.equal('u2@test.com');
			expect(res.header).to.not.be.undefined;
		});
		it('query search', async () => {
			const res = await api.getUsers({
				realm: realmname,
				query: {
					search: 'u2',
				},
				tokenProvider: specHelper.tokenProviderFactory(),
			});
			expect(res.statusCode).to.equal(200);
			expect(res.data).to.be.an('array');
			expect(res.data.length).to.equal(1);
			expect(res.header).to.not.be.undefined;
		});
	}
);
