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

const GROUP_NAME = 'g1';

const RESOURCE_TYPE_CLIENT_ROLE_MAPPING = 'CLIENT_ROLE_MAPPING';
const RESOURCE_TYPE_GROUP_MEMBERSHIP = 'GROUP_MEMBERSHIP';
const RESOURCE_TYPE_USER = 'USER';
const OPERATION_TYPE_ACTION = 'ACTION';
const OPERATION_TYPE_UPDATE = 'UPDATE';

describe(filename, () => {
	let api, realmname, clientId, group, role1, role2, users;

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

		const createGroupResponse = await api.createGroup({
			realm: realmname,
			group: {
				name: GROUP_NAME,
			},
			tokenProvider,
		});

		expect201(createGroupResponse);

		const getGroupsResponse = await api.getGroups({
			realm: realmname,
			tokenProvider,
		});

		expect200(getGroupsResponse);

		group = getGroupsResponse.data.find(g => g.name === GROUP_NAME);

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

		const addGroupToUserResponses = await Promise.all(
			getUsersResponse.data.map(({id}) =>
				api.addGroupToUser({
					realm: realmname,
					userId: id,
					groupId: group.id,
					tokenProvider,
				})
			)
		);

		addGroupToUserResponses.forEach(expect204);

		const removeGroupFromUserResponses = await Promise.all(
			getUsersResponse.data.map(({id}) =>
				api.removeGroupFromUser({
					realm: realmname,
					userId: id,
					groupId: group.id,
					tokenProvider,
				})
			)
		);

		removeGroupFromUserResponses.forEach(expect204);

		const getClientsResponse = await api.getClients({
			realm: realmname,
			query: {
				clientId,
			},
			tokenProvider,
		});

		expect200(getClientsResponse);

		const [client] = getClientsResponse.data;

		const getServiceAccountUserResponse = await api.getServiceAccountUser({
			realm: realmname,
			clientId: client.id,
			tokenProvider,
		});

		expect200(getServiceAccountUserResponse);

		const getRealmManagementClientsResponse = await api.getClients({
			realm: realmname,
			query: {
				clientId: 'realm-management',
			},
			tokenProvider,
		});

		expect200(getRealmManagementClientsResponse);

		const [realmManagementClient] = getRealmManagementClientsResponse.data;

		const getAvailableRolesResponse = await api.getAvailableClientRolesForUser(
			{
				realm: realmname,
				userId: getServiceAccountUserResponse.data.id,
				clientId: realmManagementClient.id,
				tokenProvider,
			}
		);

		expect200(getAvailableRolesResponse);

		[role1, role2] = getAvailableRolesResponse.data;

		const addClientRolesResponses = await Promise.all(
			users.map(({id}) =>
				api.addClientRolesToUser({
					realm: realmname,
					userId: id,
					clientId: realmManagementClient.id,
					roles: [role1, role2],
					tokenProvider: specHelper.tokenProviderFactory(),
				})
			)
		);

		addClientRolesResponses.map(expect204);

		const removeClientRolesResponses = await Promise.all(
			users.map(({id}) =>
				api.removeClientRolesFromUser({
					realm: realmname,
					userId: id,
					clientId: realmManagementClient.id,
					roles: [role1, role2],
					tokenProvider: specHelper.tokenProviderFactory(),
				})
			)
		);

		removeClientRolesResponses.map(expect204);
	});

	after(async () => {
		await api.deleteRealm({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});
	});

	it(`returns keycloak admin-events for user`, async () => {
		const response = await api.getAdminEvents({
			realm: realmname,
			tokenProvider: specHelper.tokenProviderFactory(),
		});

		expect200(response);
		expect(response.data.length).to.gt(0);
		expect(response.header).to.not.be.undefined;

		const withParsedRepresentations = response.data.map(adminEvent => {
			return {
				...adminEvent,
				representation: adminEvent.representation
					? JSON.parse(adminEvent.representation)
					: undefined,
			};
		});

		const groupMembershipEvents = withParsedRepresentations.filter(
			({resourceType}) => resourceType === RESOURCE_TYPE_GROUP_MEMBERSHIP
		);

		const roleMappingEvents = withParsedRepresentations.filter(
			({resourceType}) =>
				resourceType === RESOURCE_TYPE_CLIENT_ROLE_MAPPING
		);

		const resetPasswordEvents = withParsedRepresentations.filter(
			({resourceType, operationType}) =>
				resourceType === RESOURCE_TYPE_USER &&
				operationType === OPERATION_TYPE_ACTION
		);

		const enableUserEvents = withParsedRepresentations.filter(
			({resourceType, operationType}) =>
				resourceType === RESOURCE_TYPE_USER &&
				operationType === OPERATION_TYPE_UPDATE
		);

		const roleNames = [role1, role2].map(({name}) => name);

		groupMembershipEvents.forEach(adminEvent => {
			expect(adminEvent.representation.name).to.equal(GROUP_NAME);
		});

		roleMappingEvents.forEach(adminEvent => {
			adminEvent.representation.forEach(representation => {
				expect(roleNames.includes(representation.name)).to.equal(true);
			});
		});

		expect(resetPasswordEvents.length).to.equal(3);
		resetPasswordEvents.forEach(adminEvent =>
			expect(adminEvent.resourcePath.includes('reset-password')).to.equal(
				true
			)
		);

		expect(enableUserEvents.length).to.equal(3);
		enableUserEvents.forEach(adminEvent =>
			expect(adminEvent.representation).to.eql({
				enabled: true,
				emailVerified: true,
			})
		);
	});
});
