'use strict';

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const { expect } = require('chai');
const uuid = require('uuid');
const specHelper = require('../../specs/helper');

describe(__filename.split('/').pop().split('.')[0], () => {
	let api,
		realmname,
		client,
		tokenProvider,
		mappers;
	before(async () => {
		realmname = `realm-${uuid()}`;
		api = new KeycloakApi(cfg);
		tokenProvider = specHelper.tokenProviderFactory();
		await api.waitForKeycloak();
		await api.createRealm({
			realm: {
				realm: realmname,
			},
			tokenProvider,
		});

		const clients = await api.getClients({
			realm: realmname,
			query: {
				clientId: 'realm-management',
			},
			tokenProvider,
		});
		client = clients.data[0];

		mappers = await api.getClientProtocolMappers({
			realm: realmname,
			clientId: client.id,
			tokenProvider,
		});
		mappers = mappers.data;
	});
	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider,
		});
	});

	it('deletes the mapper', async () => {
		const res = await api.deleteClientProtocolMapper({
			realm: realmname,
			clientId: client.id,
			mapperId: mappers[0].id,
			tokenProvider,
		});

		expect(res.statusCode).to.equal(204);
	});
});
