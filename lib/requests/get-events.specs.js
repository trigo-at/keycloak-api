'use strict';

const {expect} = require('chai');
const uuid = require('uuid');

const cfg = require('../../specs/test-config');
const KeycloakApi = require('../keycloak-api');
const specHelper = require('../../specs/helper');

const expect200 = specHelper.expectStatusCode(200);
const expect201 = specHelper.expectStatusCode(201);
const expect204 = specHelper.expectStatusCode(204);

const filename = __filename
	.split('/')
	.pop()
	.split('.')[0];

describe(filename, () => {
	let api, realmname, clientId, users;

	before(async () => {
		realmname = `realm-${uuid()}`;
		clientId = `client-${uuid()}`;
		api = new KeycloakApi(cfg);
		const tokenProvider = specHelper.tokenProviderFactory();
		await api.waitForKeycloak();

		const createRealmResponse = await api.createRealm({
			realm: {
				realm: realmname,
				enabled: true,
				directGrantFlow: 'direct grant',
				resetCredentialsFlow: 'reset credentials',
				clientAuthenticationFlow: 'clients',
				adminEventsDetailsEnabled: true,
				adminEventsEnabled: true,
				eventsEnabled: true,
			},
			tokenProvider,
		});

		expect201(createRealmResponse);

		const createClientResponse = await api.createClient({
			realm: realmname,
			client: {
				clientId,
				secret: clientId,
				enabled: true,
				clientAuthenticatorType: 'client-secret',
				serviceAccountsEnabled: true,
				directAccessGrantsEnabled: true,
			},
			tokenProvider: specHelper.tokenProviderFactory(),
		});

		expect201(createClientResponse);

		const createUsersResponse = await Promise.all(
			[...new Array(3)].map((_, i) =>
				api.createUser({
					realm: realmname,
					user: {
						username: `u${i}`,
						lastName: `ln${i}`,
						firstName: `fn${i}`,
						email: `u${i}@test.com`,
					},
					tokenProvider,
				})
			)
		);

		createUsersResponse.forEach(expect201);

		const getUsersResponse = await api.getUsers({
			realm: realmname,
			tokenProvider,
		});

		expect200(getUsersResponse);

		users = getUsersResponse.data;

		const enableUsersResponse = await Promise.all(
			getUsersResponse.data.map(({id}) =>
				api.updateUser({
					realm: realmname,
					user: {enabled: true, emailVerified: true},
					userId: id,
					tokenProvider,
				})
			)
		);

		enableUsersResponse.forEach(expect204);

		const setPasswordResponse = await Promise.all(
			getUsersResponse.data.map(({id}) =>
				api.setUserPassword({
					realm: realmname,
					userId: id,
					password: id,
					tokenProvider,
				})
			)
		);

		setPasswordResponse.forEach(expect204);

		const loginResults = await Promise.all(
			users.map(({id, username}) =>
				api.getToken({
					realm: realmname,
					username,
					password: id,
					clientId,
					clientSecret: clientId,
					grantType: 'password',
				})
			)
		);

		loginResults.forEach(expect200);
	});

	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});

	it('returns keycloak events', async () => {
		const response = await api.getEvents({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});

		const userIds = users.map(({id}) => id);

		expect200(response);
		expect(response.data.length).to.gt(0);

		response.data.forEach(event => {
			expect(userIds.includes(event.userId)).to.equal(true);
		});
	});
});
