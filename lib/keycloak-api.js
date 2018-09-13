'use strict';

const {merge} = require('ramda');
const waitForKeycloak = require('./wait-for-keycloak');
const requests = require('./requests');
const getHeaders = require('./get-headers');
const retryOn401 = require('./retry-on-401');

class KeycloakApi {
	constructor(config, log) {
		this.config = merge(
			{
				authorizationEndpoint: 'http://localhost:8080/auth',
				clientId: 'admin-cli',
				username: 'admin',
				password: 'password',
				timeout: 30000,
				authErrorRetryCount: 2,
			},
			config
		);

		this.log = log || {
			debug: console.log, //eslint-disable-line
			info: console.log, //eslint-disable-line
			warn: console.log, //eslint-disable-line
			error: console.error, //eslint-disable-line
		};
	}

	async getAdminApiAuthToken() {
		return requests.getAdminApiAuthToken({ctx: this});
	}

	async waitForKeycloak() {
		return waitForKeycloak({ctx: this});
	}

	async setUserPassword({
		realm,
		userId,
		password,
		temporary = false,
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.setUserPassword,
			options: {realm, userId, password, temporary},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getToken({
		realm,
		username,
		password,
		clientId,
		clientSecret,
		grantType,
		refreshToken,
	}) {
		return requests.getToken({
			realm,
			username,
			password,
			clientId,
			clientSecret,
			grantType,
			refreshToken,
			ctx: this,
		});
	}

	async createRealm({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.createRealm,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async deleteRealm({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.deleteRealm,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getRealm({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.getRealm,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getRealmKeys({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.getRealmKeys,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getRealmRoles({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.getRealmRoles,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createRealmRole({realm, role, tokenProvider}) {
		return retryOn401({
			fn: requests.createRealmRole,
			options: {realm, role},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getRealms({tokenProvider}) {
		return retryOn401({
			fn: requests.getRealms,
			options: {},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createGroup({realm, group, parentGroupId, tokenProvider}) {
		return retryOn401({
			fn: requests.createGroup,
			options: {realm, group, parentGroupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async makeGroupChildOfGroup({realm, group, parentGroupId, tokenProvider}) {
		return retryOn401({
			fn: requests.makeGroupChildOfGroup,
			options: {realm, group, parentGroupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async deleteGroup({realm, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.deleteGroup,
			options: {realm, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async updateGroup({realm, group, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.updateGroup,
			options: {realm, group, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getGroup({realm, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.getGroup,
			options: {realm, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getGroupMembers({realm, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.getGroupMembers,
			options: {realm, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getGroupByPath({realm, path, tokenProvider}) {
		return retryOn401({
			fn: requests.getGroupByPath,
			options: {realm, path},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getGroups({realm, tokenProvider}) {
		return retryOn401({
			fn: requests.getGroups,
			options: {realm},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}
	async getGroupsForUser({realm, userId, tokenProvider}) {
		return retryOn401({
			fn: requests.getGroupsForUser,
			options: {realm, userId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}
	async addGroupToUser({realm, userId, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.addGroupToUser,
			options: {realm, userId, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}
	async removeGroupFromUser({realm, userId, groupId, tokenProvider}) {
		return retryOn401({
			fn: requests.removeGroupFromUser,
			options: {realm, userId, groupId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createClient({realm, client, tokenProvider}) {
		return retryOn401({
			fn: requests.createClient,
			options: {realm, client},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async updateClient({realm, client, clientId, tokenProvider}) {
		return retryOn401({
			fn: requests.updateClient,
			options: {realm, client, clientId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getClients({realm, query, tokenProvider}) {
		return retryOn401({
			fn: requests.getClients,
			options: {realm, query},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createUser({realm, user, tokenProvider}) {
		return retryOn401({
			fn: requests.createUser,
			options: {realm, user},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}
	async deleteUser({realm, userId, tokenProvider}) {
		return retryOn401({
			fn: requests.deleteUser,
			options: {realm, userId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getUser({realm, userId, tokenProvider}) {
		return retryOn401({
			fn: requests.getUser,
			options: {realm, userId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getUsers({realm, query, tokenProvider}) {
		return retryOn401({
			fn: requests.getUsers,
			options: {realm, query},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async updateUser({realm, userId, user, tokenProvider}) {
		return retryOn401({
			fn: requests.updateUser,
			options: {realm, userId, user},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getClientRoles({realm, clientId, tokenProvider}) {
		return retryOn401({
			fn: requests.getClientRoles,
			options: {realm, clientId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createClientRole({realm, clientId, role, tokenProvider}) {
		return retryOn401({
			fn: requests.createClientRole,
			options: {realm, clientId, role},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getClientProtocolMappers({
		realm,
		clientId,
		protocol = 'openid-connect',
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.getClientProtocolMappers,
			options: {realm, clientId, protocol},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async createClientProtocolMapper({realm, clientId, mapper, tokenProvider}) {
		return retryOn401({
			fn: requests.createClientProtocolMapper,
			options: {realm, clientId, mapper},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async deleteClientProtocolMapper({
		realm,
		clientId,
		mapperId,
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.deleteClientProtocolMapper,
			options: {realm, clientId, mapperId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getServiceAccountUser({realm, clientId, tokenProvider}) {
		return retryOn401({
			fn: requests.getServiceAccountUser,
			options: {realm, clientId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getAvailableClientRolesForUser({
		realm,
		userId,
		clientId,
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.getAvailableClientRolesForUser,
			options: {realm, userId, clientId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async getClientRolesForUser({realm, userId, clientId, tokenProvider}) {
		return retryOn401({
			fn: requests.getClientRolesForUser,
			options: {realm, clientId, userId},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async addClientRolesToUser({
		realm,
		userId,
		clientId,
		roles,
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.addClientRolesToUser,
			options: {realm, userId, clientId, roles},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async removeClientRolesFromUser({
		realm,
		userId,
		clientId,
		roles,
		tokenProvider,
	}) {
		return retryOn401({
			fn: requests.removeClientRolesFromUser,
			options: {realm, userId, clientId, roles},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}

	async executeActionsEmail({realm, userId, actions, tokenProvider}) {
		return retryOn401({
			fn: requests.executeActionsEmail,
			options: {realm, userId, actions},
			getHeaders,
			tokenProvider,
			ctx: this,
		});
	}
}

module.exports = KeycloakApi;
