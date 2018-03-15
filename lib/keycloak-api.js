'use strict';

const { merge } = require('ramda');
const waitForKeycloak = require('./wait-for-keycloak');
const requests = require('./requests');

const getHeaders = async ({ tokenProvider }) => {
	if (!tokenProvider) throw new Error('Mandatory argument "tokenProvider" missing');

	const token = await tokenProvider();
	return {
		authorization: `Bearer ${token}`,
		accept: 'application/json',
		'content-type': 'application/json',
	};
};

class KeycloakApi {
	constructor(config, log) {
		this.config = merge({
			authorizationEndpoint: 'http://localhost:8080/auth',
			clientId: 'admin-cli',
			username: 'admin',
			password: 'password',
			timeout: 30000,
		}, config);

		this.log = log || {
			debug: console.log, //eslint-disable-line
			info: console.log,//eslint-disable-line
			warn: console.log,//eslint-disable-line
			error: console.error,//eslint-disable-line
		};
		// console.log(this.config);
	}


	async getAdminApiAuthToken() {
		return requests.getAdminApiAuthToken({ ctx: this });
	}

	async waitForKeycloak() {
		return waitForKeycloak({ ctx: this });
	}

	async createRealm({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createRealm({ realm, headers, ctx: this });
	}
	async deleteRealm({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.deleteRealm({ realm, headers, ctx: this });
	}

	async getRealm({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getRealm({ realm, headers, ctx: this });
	}
	async getRealmKeys({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getRealmKeys({ realm, headers, ctx: this });
	}
	async getRealmRoles({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getRealmRoles({ realm, headers, ctx: this });
	}
	async createRealmRole({ realm, role, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createRealmRole({
			realm, role, headers, ctx: this,
		});
	}

	async getRealms({ tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getRealms({ headers, ctx: this });
	}

	async createGroup({
		realm, group, parentGroupId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createGroup({
			realm, group, parentGroupId, headers, ctx: this,
		});
	}
	async updateGroup({
		realm, group, groupId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.updateGroup({
			realm, group, groupId, headers, ctx: this,
		});
	}
	async getGroup({
		realm, groupId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getGroup({
			realm, groupId, headers, ctx: this,
		});
	}
	async getGroupByPath({
		realm, path, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getGroupByPath({
			realm, path, headers, ctx: this,
		});
	}

	async getGroups({ realm, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getGroups({
			realm, headers, ctx: this,
		});
	}
	async getGroupsForUser({ realm, userId, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getGroupsForUser({
			realm, headers, userId, ctx: this,
		});
	}
	async addGroupToUser({
		realm, userId, groupId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.addGroupToUser({
			realm, headers, userId, groupId, ctx: this,
		});
	}
	async removeGroupFromUser({
		realm, userId, groupId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.removeGroupFromUser({
			realm, headers, userId, groupId, ctx: this,
		});
	}

	async createClient({ realm, client, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createClient({
			realm, client, headers, ctx: this,
		});
	}
	async updateClient({
		realm, client, clientId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.updateClient({
			realm, client, clientId, headers, ctx: this,
		});
	}

	async getClients({ realm, query, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getClients({
			realm, query, headers, ctx: this,
		});
	}

	async createUser({ realm, user, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createUser({
			realm, user, headers, ctx: this,
		});
	}
	async deleteUser({
		realm, userId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.deleteUser({
			realm, userId, headers, ctx: this,
		});
	}

	async getUser({
		realm, userId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getUser({
			realm, userId, headers, ctx: this,
		});
	}
	async getUsers({ realm, query, tokenProvider }) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getUsers({
			realm, query, headers, ctx: this,
		});
	}
	async updateUser({
		realm, userId, user, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.updateUser({
			realm, userId, user, headers, ctx: this,
		});
	}

	async setUserPassword({
		realm, userId, password, temporary = false, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.setUserPassword({
			realm, userId, password, temporary, headers, ctx: this,
		});
	}

	async getToken({
		realm, username, password, clientId, clientSecret, grantType, refreshToken,
	}) {
		return requests.getToken({
			realm, username, password, clientId, clientSecret, grantType, refreshToken, ctx: this,
		});
	}

	async getClientRoles({
		realm, clientId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getClientRoles({
			realm, clientId, headers, ctx: this,
		});
	}

	async createClientRole({
		realm, clientId, role, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createClientRole({
			realm, clientId, role, headers, ctx: this,
		});
	}

	async getClientProtocolMappers({
		realm, clientId, protocol = 'openid-connect', tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getClientProtocolMappers({
			realm, clientId, protocol, headers, ctx: this,
		});
	}

	async createClientProtocolMapper({
		realm, clientId, mapper, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.createClientProtocolMapper({
			realm, clientId, mapper, headers, ctx: this,
		});
	}

	async deleteClientProtocolMapper({
		realm, clientId, mapperId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.deleteClientProtocolMapper({
			realm, clientId, mapperId, headers, ctx: this,
		});
	}

	async getServiceAccountUser({
		realm, clientId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getServiceAccountUser({
			realm, clientId, headers, ctx: this,
		});
	}
	async getAvailableClientRolesForUser({
		realm, userId, clientId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getAvailableClientRolesForUser({
			realm, userId, clientId, headers, ctx: this,
		});
	}
	async getClientRolesForUser({
		realm, userId, clientId, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.getClientRolesForUser({
			realm, userId, clientId, headers, ctx: this,
		});
	}
	async addClientRolesToUser({
		realm, userId, clientId, roles, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.addClientRolesToUser({
			realm, userId, clientId, roles, headers, ctx: this,
		});
	}
	async removeClientRolesFromUser({
		realm, userId, clientId, roles, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.removeClientRolesFromUser({
			realm, userId, clientId, roles, headers, ctx: this,
		});
	}
	async executeActionsEmail({
		realm, userId, actions, tokenProvider,
	}) {
		const headers = await getHeaders({ tokenProvider });
		return requests.executeActionsEmail({
			realm, userId, actions, headers, ctx: this,
		});
	}
}

module.exports = KeycloakApi;
